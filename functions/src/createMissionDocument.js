const { Timestamp } = require('firebase-admin/firestore');

const DAY_MS = 86_400_000;

exports.createMissionDocument = ({ now, profile, template, timezone }) => {
  if (template.eventType !== 'birthday' || !isLocalDate(profile.birthday)) {
    throw new Error('A valid birthday is required for this template.');
  }

  const eventDate = nextAnnualDate(profile.birthday, now.toDate(), timezone);
  const opensDate = addDays(eventDate, template.trigger.eventOffsetDays);
  const successUntilDate = addDays(opensDate, template.trigger.successDays);
  const failAtDate = addDays(successUntilDate, template.trigger.successDays);
  const opensAt = timestampAtStartOfDay(opensDate, timezone);
  const successUntil = timestampAtStartOfDay(successUntilDate, timezone);
  const failAt = timestampAtStartOfDay(failAtDate, timezone);
  const occurrenceYear = eventDate.slice(0, 4);

  return {
    eventDate,
    failAt,
    generationKey: `${template.id}:${occurrenceYear}`,
    importance: template.rankImpact.appliesTo,
    lifecycleStatus: now.toMillis() < opensAt.toMillis() ? 'scheduled' : 'active',
    occurrenceKey: `${template.eventType}:${eventDate}:${template.id}`,
    opensAt,
    rulesetVersion: '0.2',
    sourceImportantDateId: 'birthday',
    status: now.toMillis() < opensAt.toMillis() ? 'scheduled' : 'active',
    successUntil,
    targetDate: eventDate,
    template,
  };
};

function nextAnnualDate(date, now, timezone) {
  const [, month, day] = date.split('-').map(Number);
  const today = localDateParts(now, timezone);
  const thisYear = annualDate(today.year, month, day);
  return thisYear >= formatDate(today.year, today.month, today.day)
    ? thisYear
    : annualDate(today.year + 1, month, day);
}

function annualDate(year, month, day) {
  return formatDate(year, month, Math.min(day, daysInMonth(year, month)));
}

function timestampAtStartOfDay(date, timezone) {
  const [year, month, day] = date.split('-').map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const offset = offsetMilliseconds(utcMidnight, timezone);
  return Timestamp.fromMillis(utcMidnight - offset);
}

function offsetMilliseconds(timestamp, timezone) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' })
    .formatToParts(new Date(timestamp)).find((part) => part.type === 'timeZoneName')?.value;
  if (name === 'GMT') return 0;
  const match = /^GMT([+-])(\d{2}):(\d{2})$/.exec(name ?? '');
  if (!match) throw new Error('The save timezone is invalid.');
  const offset = (Number(match[2]) * 60 + Number(match[3])) * 60_000;
  return match[1] === '+' ? offset : -offset;
}

function localDateParts(now, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return Object.fromEntries(parts.filter((part) => ['year', 'month', 'day'].includes(part.type)).map((part) => [part.type, Number(part.value)]));
}

function addDays(date, days) {
  const [year, month, day] = date.split('-').map(Number);
  const result = new Date(Date.UTC(year, month - 1, day) + days * DAY_MS);
  return formatDate(result.getUTCFullYear(), result.getUTCMonth() + 1, result.getUTCDate());
}

function isLocalDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
