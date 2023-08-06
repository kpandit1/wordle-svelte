function treatAsUTC(date: Date) {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
}
export function numDaysBetween(startDate: Date, endDate: Date): number {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) /
      millisecondsPerDay
  );
}
