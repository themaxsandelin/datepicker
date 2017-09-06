Date.prototype.isLeapYear = function() {
  const year = this.getFullYear();
  // No leap years before the year 1582
  if (year < 1582) return false;
  // Make sure the year is divisible by 4
  if ((year % 4) !== 0) return false;
  // Check if date is a century and make sure if so that it is divisible by 400
  if ((year % 100) === 0 && (year % 400) !== 0) return false;
  return true;
}

Date.prototype.getLocalTimestamp = function() {
  let timestamp = this.getTime();
  if (this.getTimezoneOffset() < 0) {
    timestamp += (3600000 * ((this.getTimezoneOffset() * -1) / 60));
  } else if (this.getTimezoneOffset() > 0) {
    timestamp -= (3600000 * (this.getTimezoneOffset() / 60));
  }
  return timestamp;
}

Date.prototype.getFirstWeek = function(diff) {
  const year = this.getFullYear() + ((diff !== undefined) ? diff:0);
  const fromDate = new Date((year - 1) + '-12-31T00:00:00');
  const toDate = new Date(year + '-01-01T00:00:00');
  const firstDay = ((toDate.getDay()) ? toDate.getDay():7);

  // Default week is 1 if the first day of the year is a Mon-Thu
  let week = 1;
  if (firstDay > 4) {
    // If it's a Fri-Sun it's either during week 52 or 53 (Friday or Saturday while last year was a leap year)
    const comparison = (firstDay === 6) ? (fromDate.isLeapYear()):(firstDay === 5);
    week = (comparison) ? 53:52
  }

  // Return the week as well as the timestamp for the first day (00:00:00) and last day (23:59:59).
  const startTime = toDate.getTime() - ((firstDay > 1) ? (86400000 * (firstDay - 1)):0);
  const endTime = toDate.getTime() + ((firstDay < 7) ? (86400000 * (7 - firstDay)):0) + 86399000;
  return {
    week: week,
    startTime: new Date(startTime).getLocalTimestamp(),
    endTime: new Date(endTime).getLocalTimestamp()
  };
}

Date.prototype.getWeek = function() {
  const firstWeek = this.getFirstWeek();
  const lastWeek = this.getFirstWeek(1);

  // Grab the date's timestamp (milliseconds) and first of all check if it occurs on the first or the last week of the year.
  // If not then yo
  const timestamp = this.getLocalTimestamp();
  if (timestamp >= firstWeek.startTime && timestamp <= firstWeek.endTime) return firstWeek.week;
  if (timestamp >= lastWeek.startTime && timestamp <= lastWeek.endTime) return lastWeek.week;

  // Grab the first Monday of the year and then it's timestamp (milliseconds) while taking into account the timezone offset.
  const firstMondayTimestamp = (firstWeek.week === 1) ? firstWeek.startTime:firstWeek.endTime + 1000;
  const firstMonday = new Date(firstMondayTimestamp);

  const week = Math.floor(((((((timestamp - firstMondayTimestamp) / 1000) / 60) / 60) / 24) / 7) + 1);
  return week;
}

Date.prototype.isToday = function() {
  const today = new Date();
  return (today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()) === (this.getFullYear() + '-' + this.getMonth() + '-' + this.getDate());
}

const now = new Date('2017-09-06T16:40:00');

console.log( now.getWeek() );
console.log( now.isLeapYear() );
console.log( now.isToday() );
