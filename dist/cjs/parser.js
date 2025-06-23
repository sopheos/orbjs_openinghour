"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = parser;
var constant = _interopRequireWildcard(require("./constant"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var isRuleModifier = /^(open|closed)$/;
var isTime = /^(([01][0-9])|(2[0-3])):[0-5][0-9]-(([01][0-9])|(2[0-3])):[0-5][0-9]$/;
var isWeekDay = /^((Mo|Tu|We|Th|Fr|Sa|Su|PH),?)+$/;
var isMonth = /^((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?)+$/;

/**
 * Créé une liste d'objets horaires à partir du format opening_hour
 * @param {string} oh oh
 * @param {string | null} date date utilisé pour les périodes répétable, celle du device par défauts
 * @returns une liste d'horaires si opening_hour valide, null sinon
 */
function parser(oh, date) {
  var currentDate = date ? new Date(date) : new Date();
  var schedules = [];
  var listRules = oh.split(';');
  listRules.forEach(function (ruleSequence) {
    var schedule = {
      days: [],
      months: [],
      period: {
        start: null,
        end: null,
        repeat: null
      },
      time: {
        open: 0,
        start: null,
        end: null
      },
      type: 0
    };
    var parts = ruleSequence.split(' ');
    var index = parts.length - 1;

    // Status
    if (index >= 0 && isRuleModifier.test(parts[index])) {
      var status = constant.scheduleStatus.find(function (status) {
        return status.name === parts[index];
      });
      if (!status) return null;
      schedule.time.open = status.id;
      index -= 1;
    }

    // Heure minute
    if (index >= 0 && isTime.test(parts[index])) {
      var listTimes = parts[index].split('-');
      schedule.time.start = listTimes[0];
      schedule.time.end = listTimes[1];
      index -= 1;
    }

    // Jour
    if (index >= 0 && isWeekDay.test(parts[index])) {
      var listDay = parts[index].split(',');
      listDay.forEach(function (day) {
        var scheduleDay = constant.scheduleDays.find(function (scheduleDay) {
          return scheduleDay.name === day;
        });
        if (!scheduleDay) return null;
        schedule.days.push(scheduleDay.id);
      });
      index -= 1;
    }

    // Mois
    if (index >= 0 && isMonth.test(parts[index])) {
      schedule.type = 1;
      var listMonths = parts[index].split(',');
      listMonths.forEach(function (month) {
        var scheduleMonth = constant.scheduleMonths.find(function (scheduleMonth) {
          return scheduleMonth.name === month;
        });
        if (!scheduleMonth) return null;
        schedule.months.push(scheduleMonth.id);
      });
      index -= 1;
    }

    // Période
    if (index >= 0) {
      schedule.type = 2;
      if (index === 4) {
        parts.splice(0, 0, "".concat(currentDate.getFullYear()));
        parts.splice(4, 0, "".concat(currentDate.getFullYear()));
        schedule.period.repeat = true;
      } else {
        schedule.period.repeat = false;
      }
      var monthStart = constant.scheduleMonths.find(function (scheduleMonth) {
        return scheduleMonth.name === parts[1];
      });
      if (!monthStart) return null;
      var strStart = monthStart.id < 10 ? "0".concat(monthStart.id) : monthStart.id;
      var monthEnd = constant.scheduleMonths.find(function (scheduleMonth) {
        return scheduleMonth.name === parts[5];
      });
      if (!monthEnd) return null;
      var strEnd = monthEnd.id < 10 ? "0".concat(monthEnd.id) : monthEnd.id;
      var startDate = "".concat(strStart, "-").concat(parts[2]);
      var endDate = "".concat(strEnd, "-").concat(parts[6]);
      if (startDate > endDate) {
        parts[4] = "".concat(currentDate.getFullYear() + 1);
      }
      schedule.period.start = "".concat(parts[0], "-").concat(startDate);
      schedule.period.end = "".concat(parts[4], "-").concat(endDate);
    }
    schedules.push(schedule);
  });
  return schedules;
}
//# sourceMappingURL=parser.js.map