const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { createMissionDocument } = require('./createMissionDocument');
const { gameRules } = require('./gameRules');
const { missionTemplates } = require('./missionTemplates');

initializeApp();

const db = getFirestore();

exports.createMission = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication is required.');
  const templateId = request.data?.templateId;
  const template = missionTemplates[templateId];
  if (!template) throw new HttpsError('invalid-argument', 'The mission template is not available.');

  const userId = request.auth.uid;
  const saveRef = db.doc(`users/${userId}/saves/default`);
  const profileRef = saveRef.collection('profile').doc('current');
  return db.runTransaction(async (transaction) => {
    const [save, profile] = await Promise.all([transaction.get(saveRef), transaction.get(profileRef)]);
    if (!save.exists || save.data().ownerUserId !== userId) throw new HttpsError('permission-denied', 'Save is unavailable.');
    if (!profile.exists) throw new HttpsError('failed-precondition', 'Profile is unavailable.');

    const now = Timestamp.now();
    let mission;
    try {
      mission = createMissionDocument({ now, profile: profile.data(), template, timezone: save.data().timezone ?? 'UTC' });
    } catch (error) {
      throw new HttpsError('failed-precondition', error instanceof Error ? error.message : 'Mission cannot be created.');
    }
    const duplicate = await transaction.get(saveRef.collection('missions').where('generationKey', '==', mission.generationKey).limit(1));
    if (!duplicate.empty) return { created: false, missionId: duplicate.docs[0].id };

    const missionRef = saveRef.collection('missions').doc();
    transaction.create(missionRef, { ...mission, createdAt: now, updatedAt: now });
    return {
      analytics: {
        daysBeforeDue: Math.ceil((mission.successUntil.toMillis() - now.toMillis()) / 86_400_000),
        difficulty: 'normal', missionSource: 'system', missionType: template.eventType,
      },
      created: true, missionId: missionRef.id, status: mission.status,
    };
  });
});

exports.resolveMission = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication is required.');
  const missionId = request.data?.missionId;
  if (typeof missionId !== 'string' || missionId.length === 0) {
    throw new HttpsError('invalid-argument', 'missionId is required.');
  }

  const userId = request.auth.uid;
  const saveRef = db.doc(`users/${userId}/saves/default`);
  const missionRef = saveRef.collection('missions').doc(missionId);
  const resolutionRef = saveRef.collection('resolutions').doc(missionId);
  const progressionRef = saveRef.collection('state').doc('progression');
  const collectionRef = saveRef.collection('state').doc('collection');

  return db.runTransaction(async (transaction) => {
    const [save, mission, existingResolution, progression, collection] = await Promise.all([
      transaction.get(saveRef), transaction.get(missionRef), transaction.get(resolutionRef),
      transaction.get(progressionRef), transaction.get(collectionRef),
    ]);
    if (!save.exists || save.data().ownerUserId !== userId) throw new HttpsError('permission-denied', 'Save is unavailable.');
    if (!mission.exists) throw new HttpsError('not-found', 'Mission is unavailable.');
    if (existingResolution.exists) throw new HttpsError('failed-precondition', 'Mission is already resolved.');

    const now = Timestamp.now();
    const missionData = mission.data();
    if (missionData.opensAt && now.toMillis() < missionData.opensAt.toMillis()) {
      throw new HttpsError('failed-precondition', 'Mission is not active yet.');
    }
    const result = resolveResult(missionData, now);
    const reward = missionData.template.reward[result];
    const rankDelta = missionData.template.rankImpact[result];
    const previous = progression.exists ? progression.data() : { exp: 0, combo: 0, rankScore: 0, status: 'danger' };
    const next = {
      exp: previous.exp + reward.expDelta,
      combo: result === 'fail' ? 0 : previous.combo + reward.comboDelta,
      rankScore: clampRank(previous.rankScore + rankDelta),
      status: clampRank(previous.rankScore + rankDelta) >= gameRules.progression.safeRankThreshold ? 'safe' : 'danger',
      updatedAt: now,
    };
    const nextCollection = evaluateCollection(collection.exists ? collection.data() : { items: [], graves: [] }, result, previous.rankScore, next, now);

    transaction.update(missionRef, { lifecycleStatus: 'resolved', resolution: result, resolvedAt: now, status: 'resolved' });
    transaction.set(resolutionRef, { missionId, result, reward: { ...reward, rankDelta }, resolvedAt: now });
    transaction.set(progressionRef, next);
    transaction.set(collectionRef, { ...nextCollection, updatedAt: now });
    return { result, reward: { ...reward, rankDelta }, gameState: next, collectionState: nextCollection };
  });
});

function resolveResult(mission, now) {
  if (now.toMillis() < mission.successUntil.toMillis()) return 'success';
  if (now.toMillis() < mission.failAt.toMillis()) return 'late';
  return 'fail';
}

function evaluateCollection(state, result, previousRank, next, now) {
  const items = [...(state.items || [])];
  const graves = [...(state.graves || [])];
  const has = (id) => items.some((item) => item.id === id);
  gameRules.collectionUnlocks.forEach((rule) => {
    if (has(rule.id) || !isCollectionRuleUnlocked(rule, result, previousRank, next)) return;
    items.push({ id: rule.id, type: rule.type, name: rule.name, unlockedAt: now });
    if (rule.type === 'grave') {
      graves.push({ id: rule.id, createdAt: now, reason: 'rank_reached_negative_ten', rankScore: rule.condition.value });
    }
  });
  return { items, graves };
}

function clampRank(rankScore) {
  return Math.max(gameRules.progression.minRank, Math.min(gameRules.progression.maxRank, rankScore));
}

function isCollectionRuleUnlocked(rule, result, previousRank, next) {
  if (rule.condition.kind === 'firstNonFail') return result !== 'fail';
  if (rule.condition.kind === 'comboAtLeast') return next.combo >= rule.condition.value;
  return previousRank > rule.condition.value && next.rankScore === rule.condition.value;
}
