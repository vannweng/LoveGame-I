exports.resolveImportantDateSource = (profile, sourceId = 'birthday') => {
  const builtIn = {
    birthday: profile.birthday,
    marriageAnniversary: profile.marriageDate,
    relationshipAnniversary: profile.relationshipStartDate,
  };
  if (Object.hasOwn(builtIn, sourceId)) {
    return {
      date: builtIn[sourceId], effortLevel: profile.importantDateEffort?.[sourceId] ?? 'full',
      id: sourceId, importance: 'survival',
    };
  }
  if (!sourceId.startsWith('custom:')) throw new Error('The important date source is unavailable.');
  const requestedId = sourceId.slice('custom:'.length);
  const customDate = (profile.customImportantDates ?? []).find((date) => getDateId(date) === requestedId);
  if (!customDate) throw new Error('The custom important date is unavailable.');
  return {
    date: customDate.date, effortLevel: customDate.effortLevel ?? 'full',
    id: sourceId, importance: customDate.importance ?? 'survival',
  };
};

function getDateId(date) {
  return date.id ?? `legacy-${stableHash(`${date.title}:${date.date}`)}`;
}

function stableHash(value) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}
