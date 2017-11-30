define([
  'lodash',
  'moment',
],
function (_, moment) {
  'use strict';

  function IndexPattern(pattern, interval) {
    this.pattern = pattern;
    this.interval = interval;
  }

  IndexPattern.intervalMap = {
    "Hourly":   { startOf: 'hour',     amount: 'hours'},
    "Daily":   { startOf: 'day',      amount: 'days'},
    "Weekly":  { startOf: 'isoWeek',  amount: 'weeks'},
    "Monthly": { startOf: 'month',    amount: 'months'},
    "Yearly":  { startOf: 'year',     amount: 'years'},
  };

  IndexPattern.prototype.getIndexForToday = function() {
    if (this.interval) {
      return moment.utc().utcOffset(+480).format(this.pattern);
    } else {
      return this.pattern;
    }
  };

  IndexPattern.prototype.getIndexList = function(from, to) {
    if (!this.interval) {
      return this.pattern;
    }

    var intervalInfo = IndexPattern.intervalMap[this.interval];
    var start = moment(from).utc().utcOffset(+480).startOf(intervalInfo.startOf);
    var end = moment(to).utc().utcOffset(+480).startOf(intervalInfo.startOf).valueOf();
    var indexList = [];

    while (start <= end) {
      indexList.push(start.format(this.pattern));
      start.add(1, intervalInfo.amount);
    }

    return indexList;
  };

  return IndexPattern;
});
