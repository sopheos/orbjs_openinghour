"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = builder;
var constant = _interopRequireWildcard(require("./constant"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
/**
 * Créé une horaire au format opening_hours à partir d'une liste d'objets horaires
 * @param {Array<Schedule>} schedules
 * @returns {string | null} opening_hour si horaires valident, null sinon
 */
function builder(schedules) {
  var listRules = [];
  schedules.forEach(function (schedule) {
    var ruleSequence = [];

    // Période
    if (schedule.period.start && schedule.period.end) {
      // Début période
      var splitStart = schedule.period.start.split('-');
      var dateStart = schedule.period.repeat ? '' : "".concat(splitStart[0], " ");
      var monthStart = constant.scheduleMonths.find(function (month) {
        return month.id === parseInt(splitStart[1], 10);
      });
      if (!monthStart) return null;
      dateStart += "".concat(monthStart.name, " ").concat(splitStart[2]);

      // Fin période
      var splitEnd = schedule.period.end.split('-');
      var dateEnd = schedule.period.repeat ? '' : "".concat(splitEnd[0], " ");
      var monthEnd = constant.scheduleMonths.find(function (scheduleMonth) {
        return scheduleMonth.id === parseInt(splitEnd[1], 10);
      });
      if (!monthEnd) return null;
      dateEnd += "".concat(monthEnd.name, " ").concat(splitEnd[2]);
      ruleSequence.push("".concat(dateStart, " - ").concat(dateEnd));
    }

    // Mois
    var monthRange = [];
    schedule.months.forEach(function (month) {
      var scheduleMonth = constant.scheduleMonths.find(function (scheduleMonth) {
        return scheduleMonth.id === month;
      });
      if (!scheduleMonth) return null;
      monthRange.push(scheduleMonth.name);
    });
    if (monthRange.length) ruleSequence.push(monthRange.join(','));

    // Jour
    var dayRange = [];
    schedule.days.forEach(function (day) {
      var scheduleDay = constant.scheduleDays.find(function (scheduleDay) {
        return scheduleDay.id === day;
      });
      if (!scheduleDay) return null;
      dayRange.push(scheduleDay.name);
    });
    if (dayRange.length) ruleSequence.push(dayRange.join(','));

    // Heure minute
    if (schedule.time.start && schedule.time.end) {
      ruleSequence.push("".concat(schedule.time.start, "-").concat(schedule.time.end));
    }

    // Status
    var status = constant.scheduleStatus.find(function (status) {
      return status.id === schedule.time.open;
    });
    if (!status) return null;
    ruleSequence.push(status.name);
    listRules.push(ruleSequence.join(' '));
  });
  return listRules.join(';');
}
//# sourceMappingURL=builder.js.map