"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedules = void 0;
var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _holiday = require("./holiday");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Schedules = exports.Schedules = /*#__PURE__*/function () {
  function Schedules(schedules, currentDate) {
    var admin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    (0, _classCallCheck2.default)(this, Schedules);
    (0, _defineProperty2.default)(this, "listHoliday", []);
    (0, _defineProperty2.default)(this, "listOtherHoliday", []);
    (0, _defineProperty2.default)(this, "listAdmins", []);
    (0, _defineProperty2.default)(this, "schedules", []);
    (0, _defineProperty2.default)(this, "admin", null);
    (0, _defineProperty2.default)(this, "date", void 0);
    (0, _defineProperty2.default)(this, "dayIndex", [6, 0, 1, 2, 3, 4, 5, 7]);
    (0, _defineProperty2.default)(this, "dayKey", [1, 2, 3, 4, 5, 6, 0, 7]);
    (0, _defineProperty2.default)(this, "monthIndex", [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    (0, _defineProperty2.default)(this, "monthKey", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.schedules = schedules;
    this.date = new Date(currentDate);
    this.admin = admin;
    var holiday = new _holiday.Holiday(this.date.getFullYear());
    this.listHoliday = holiday.getHoliday();
    this.listOtherHoliday = holiday.getOtherHoliday();
    this.listAdmins = holiday.getAdmins();
  }

  /**
    * Retourne l'état actuelle de l'horaires ainsi que la liste des horaires correspondant au jour renseigné
    * @param {number} size Length of the preview (7 day by default)
    * @returns {Object}
    */
  return (0, _createClass2.default)(Schedules, [{
    key: "getPreview",
    value: function getPreview() {
      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 7;
      if (!size) return {};
      var weekData = new Array(size);
      var preview = new Array(size);
      var date = new Date(this.date);
      date.setHours(0, 0, 0, 0);
      for (var index = 0; index < size; index++) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dayWeek = date.getDay();
        weekData[index] = {
          type: 0,
          date: new Date(date),
          strDate: "".concat(month < 10 ? "0".concat(month) : month, "-").concat(day < 10 ? "0".concat(day) : day),
          month: month,
          dayWeek: dayWeek
        };
        preview[index] = {
          day: dayWeek,
          times: []
        };
        date.setDate(date.getDate() + 1);
      }
      var isOpen = null;
      var currentType = null;
      var isFr = this.admin ? this.admin.split('-')[0] === 'FR' : false;
      for (var i = 0; i < this.schedules.length; i += 1) {
        var _schedule$period$star, _schedule$period$end;
        var schedule = this.schedules[i];
        var scheduleType = schedule.type === 2 && !schedule.period.repeat ? 10 : schedule.type;
        var periodStart = new Date((_schedule$period$star = schedule.period.start) !== null && _schedule$period$star !== void 0 ? _schedule$period$star : 0);
        periodStart.setHours(0, 0, 0, 0);
        var periodEnd = new Date((_schedule$period$end = schedule.period.end) !== null && _schedule$period$end !== void 0 ? _schedule$period$end : 0);
        periodEnd.setHours(23, 59, 59, 999);
        for (var _index = 0; _index < weekData.length; _index++) {
          // Periods or Months
          if (schedule.type === 2) {
            if (weekData[_index].date < periodStart || weekData[_index].date > periodEnd) {
              continue;
            }
          } else if (schedule.type === 1 && !schedule.months.includes(weekData[_index].month)) {
            continue;
          }

          // Days
          if (!schedule.days.includes(weekData[_index].dayWeek)) {
            if (schedule.days.some(function (dayId) {
              return dayId === 7;
            }) && isFr) {
              if (!this.listHoliday.includes(weekData[_index].strDate)) {
                if (!this.admin || !this.listAdmins.includes(this.admin) || !this.listOtherHoliday.includes(weekData[_index].strDate)) {
                  continue;
                }
              }
            } else {
              continue;
            }
          }

          // Time
          if (scheduleType >= weekData[_index].type) {
            var start = schedule.time.start;
            var end = schedule.time.end;
            var open = !!schedule.time.open;

            // Today state
            var scheduleIsOpen = null;
            if (_index === 0) {
              var hour = this.date.getHours();
              var minute = this.date.getMinutes();
              var strHour = "".concat(hour < 10 ? "0".concat(hour) : hour, ":").concat(minute < 10 ? "0".concat(minute) : minute);
              if (start && end) {
                if (start <= strHour && strHour < end) {
                  scheduleIsOpen = open;
                } else {
                  scheduleIsOpen = false;
                }
              } else {
                scheduleIsOpen = open;
              }
              currentType = schedule.type;
            }

            // Add or override schedule
            if (scheduleType === weekData[_index].type) {
              preview[_index].times.push({
                open: open,
                start: start,
                end: end
              });
              if (_index === 0) {
                isOpen = isOpen !== null && isOpen !== void 0 ? isOpen : scheduleIsOpen;
              }
            } else if (scheduleType > weekData[_index].type) {
              weekData[_index].type = scheduleType;
              preview[_index].times = [{
                open: open,
                start: start,
                end: end
              }];
              if (_index === 0) {
                isOpen = scheduleIsOpen;
              }
            }
          }
        }
      }
      return {
        isOpen: isOpen,
        type: currentType,
        preview: preview
      };
    }

    /**
     * Consecutive days with the same schedule are grouped 
     * (public holidays are not grouped unless is schedules is the same as the other day of the week)
     */
  }, {
    key: "concatWeek",
    value: function concatWeek(week) {
      var _this = this;
      var concatWeek = [];
      var start = null;
      var prevHash = null;
      var prevKey = null;
      var prevTime = null;
      var listDays = [];
      week === null || week === void 0 || week.forEach(function (times, index) {
        var key = _this.dayKey[index];
        var hash = JSON.stringify(times);
        var endArray = week.length - 1 === index;
        var notSame = prevHash && prevHash !== hash;
        if (start === null) {
          start = key;
        } else if (notSame || endArray) {
          var notAllDay = key === 7 && (notSame || start !== 1);
          var end = notSame || notAllDay ? prevKey : key;
          if (!notSame) {
            listDays.push(key);
          }
          concatWeek.push({
            days: listDays,
            start: start,
            end: end !== start ? end : null,
            times: prevTime
          });
          start = key;
          listDays = [];
          if (notAllDay) {
            concatWeek.push({
              days: [start],
              start: start,
              end: null,
              times: times
            });
          }
        }
        prevHash = hash;
        prevKey = key;
        prevTime = times;
        listDays.push(key);
      });
      return concatWeek.length ? concatWeek : null;
    }

    /**
     * Consecutive months with the same schedule are grouped
     */
  }, {
    key: "concatMonths",
    value: function concatMonths(months) {
      var _this2 = this;
      var concatMonths = [];
      var start = null;
      var prevHash = null;
      var prevKey = null;
      var prevWeek = null;
      var listMonths = [];
      months.forEach(function (week, index) {
        var key = _this2.monthKey[index];
        var hash = JSON.stringify(week);
        var endArray = months.length - 1 === index;
        var notSame = prevHash && prevHash !== hash;
        if (start === null) {
          start = key;
        } else if (notSame || endArray) {
          var end = notSame ? prevKey : key;
          if (!notSame) {
            listMonths.push(key);
          }
          concatMonths.push({
            start: start,
            end: end !== start ? end : null,
            months: listMonths,
            week: _this2.concatWeek(prevWeek)
          });
          start = key;
          listMonths = [];
          if (notSame && endArray) {
            concatMonths.push({
              start: start,
              end: null,
              months: [start],
              week: _this2.concatWeek(week)
            });
          }
        }
        prevHash = hash;
        prevKey = key;
        prevWeek = week;
        listMonths.push(key);
      });
      return concatMonths;
    }

    /**
     * Transform periods object in array 
     */
  }, {
    key: "concatPeriods",
    value: function concatPeriods(periods) {
      var ctx = this;
      return Object.keys(periods).map(function (key) {
        var _periods$key = periods[key],
          start = _periods$key.start,
          end = _periods$key.end,
          repeat = _periods$key.repeat,
          week = _periods$key.week;
        return {
          start: start,
          end: end !== start ? end : null,
          repeat: repeat,
          week: ctx.concatWeek(week)
        };
      });
    }

    /**
     * Sort by day
     * @param {Array} week 
     * @param {Schedule} schedule 
     */
  }, {
    key: "sortWeek",
    value: function sortWeek(week, schedule) {
      var _this3 = this;
      schedule.days.forEach(function (day) {
        var index = _this3.dayIndex[day];
        var weekDay = week[index];
        var result = _objectSpread(_objectSpread({}, schedule.time), {}, {
          open: !!schedule.time.open
        });
        if (weekDay) {
          weekDay.push(result);
        } else {
          week[index] = [result];
        }
      });
    }

    /**
     * @returns All schedules in a concatenated format
     */
  }, {
    key: "getConcat",
    value: function getConcat() {
      var _this4 = this;
      var globalWeek = new Array(8).fill(null);
      var months = new Array(12).fill(null);
      var periods = {};
      this.schedules.forEach(function (schedule) {
        var _periods$period;
        switch (schedule.type) {
          case 0:
            _this4.sortWeek(globalWeek, schedule);
            break;
          case 1:
            // Sort by month
            schedule.months.forEach(function (month) {
              var index = _this4.monthIndex[month];
              var week = months[index];
              if (!week) {
                week = new Array(8).fill(null);
                months[index] = week;
              }
              _this4.sortWeek(week, schedule);
            });
            break;
          case 2:
            // Sort by periods
            var _schedule$period = schedule.period,
              start = _schedule$period.start,
              end = _schedule$period.end,
              repeat = _schedule$period.repeat;
            var period = "".concat(repeat, "_").concat(start, "_").concat(end);
            var week = (_periods$period = periods[period]) === null || _periods$period === void 0 ? void 0 : _periods$period.week;
            if (!week) {
              week = new Array(8).fill(null);
              periods[period] = {
                start: start,
                end: end,
                repeat: repeat,
                week: week
              };
            }
            _this4.sortWeek(week, schedule);
            break;
          default:
            break;
        }
      });
      return {
        global: this.concatWeek(globalWeek),
        months: this.concatMonths(months),
        periods: this.concatPeriods(periods)
      };
    }
  }]);
}();
//# sourceMappingURL=schedules.js.map