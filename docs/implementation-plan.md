# MVP Implementation Plan

## Phase 0 — Rules and environment

Scope: lock ruleset v0.2, Firebase environments, Expo/EAS configuration strategy, and time semantics.

Acceptance criteria:

- Game rules in `game-rules-v0.2.md` are approved.
- Development, staging, and production use separate Firebase projects.
- Save timezone and server-time authority are documented.
- EXP values remain explicitly marked pending, rather than silently hard-coded.

## Phase 1 — Foundation and domain tests

Scope: Expo TypeScript foundation, route skeleton, pure domain entities/policies/resolver, repository interfaces, test setup.

Acceptance criteria:

- Domain imports no React, Expo, Firebase, or UI code.
- Unit tests cover every Success/Late/Fail boundary for all five templates.
- Rank stays in `-10..+10`.
- Late preserves Combo; Fail resets Combo.
- Normal missions never change Rank.
- The same Mission cannot resolve twice.

## Phase 2 — Authentication and save onboarding

Scope: Google Login, auth bootstrap, LoveSave creation, partner label, relationship start date, birthday, custom important dates, Firestore rules.

Acceptance criteria:

- Android development build can sign in, sign out, and restore a session.
- A user can only read and write their own save.
- Calendar dates remain correct across app restarts and timezone changes.
- Onboarding retries do not create duplicate active saves.

## Phase 3 — Important dates and mission generation

Scope: Important Date CRUD, versioned template catalog, Event Engine, Mission Engine, mission list/detail screens.

Acceptance criteria:

- An occurrence produces at most one Mission per template.
- All five offsets and Success windows generate correctly.
- Annual dates, year boundaries, and leap-day behavior have tests.
- UI displays scheduled, active, and resolved missions correctly.
- UI does not calculate outcomes.

## Phase 4 — Authoritative resolution and Home progression

Scope: callable/HTTP resolution function, transaction, EXP/Combo/Rank policy, Home survival state, GG and revival state.

Acceptance criteria:

- Server time determines Success, Late, or Fail.
- Repeated taps and network retries cannot grant duplicate rewards.
- Player abandonment and automatic deadline expiry create exactly one Fail.
- Survival Fail decrements Rank; normal Fail does not.
- Rank `-10` enters GG and creates a single Revival record.
- Revival success restores Rank to `-5`, resets Combo to `0`, and preserves EXP.

## Phase 5 — Collection and tombstone

Scope: static collection catalog, unlock evaluator, collection tab, title and tombstone presentation.

Acceptance criteria:

- Unlocks occur once and retain source resolution IDs.
- Tombstone remains visible after revival.
- Collection is consistent after login on a different device.

## Phase 6 — Push notifications

Scope: permission flow, device registration, notification jobs, scheduled dispatcher, deep links, receipt/error cleanup.

Acceptance criteria:

- Android device receives test pushes in foreground, background, and terminated states.
- Notification opens the correct authorized Mission.
- Permission refusal does not block gameplay.
- Duplicate reminders are prevented by dedupe keys.
- GG prioritizes revival notifications and lowers normal reminder frequency.
- Failed/invalid tokens are disabled safely.

## Phase 7 — Hardening and Android release candidate

Scope: empty/error/loading/offline states, analytics/crash reporting, Firestore rules emulator tests, EAS Android build, privacy/deletion plan.

Acceptance criteria:

- The complete core loop works from Important Date to next occurrence.
- Network interruption, app restart, and double submission preserve progression integrity.
- Firestore rules are automated-tested.
- A production Android build passes smoke tests on target devices/API levels.
- User data deletion behavior is documented and implemented before release.

## Explicitly deferred

- iOS optimisation and App Store release.
- Couple linking, multiplayer, PvP, social sharing, leaderboards.
- AI chat/story generation, CMS, marketplace, subscriptions, complex skill systems.
- Full offline conflict resolution, self-hosted notification infrastructure, microservices, and event-sourcing infrastructure.
- Visual polish, extensive animations, and large content pipelines before the core loop is verified.
