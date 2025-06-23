import * as constant from "./constant";
import { Schedule } from "./schedules";

/**
 * Créé une horaire au format opening_hours à partir d'une liste d'objets horaires
 * @param {Array<Schedule>} schedules
 * @returns {string | null} opening_hour si horaires valident, null sinon
 */
export function builder(schedules: Array<Schedule>): string | null {
  const listRules: Array<String> = [];

  schedules.forEach((schedule: Schedule) => {
    const ruleSequence = [];

    // Période
    if (schedule.period.start && schedule.period.end) {
      // Début période
      const splitStart = schedule.period.start.split('-');
      let dateStart = schedule.period.repeat ? '' : `${splitStart[0]} `;
      const monthStart = constant.scheduleMonths.find((month) => month.id === parseInt(splitStart[1], 10));
      if(!monthStart) return null;
      dateStart += `${monthStart.name} ${splitStart[2]}`;

      // Fin période
      const splitEnd = schedule.period.end.split('-');
      let dateEnd = schedule.period.repeat ? '' : `${splitEnd[0]} `;
      const monthEnd = constant.scheduleMonths.find((scheduleMonth) => scheduleMonth.id === parseInt(splitEnd[1], 10));
      if(!monthEnd) return null;
      dateEnd += `${monthEnd.name} ${splitEnd[2]}`;

      ruleSequence.push(`${dateStart} - ${dateEnd}`);
    }

    // Mois
    const monthRange: Array<String> = [];
    schedule.months.forEach((month) => {
      const scheduleMonth = constant.scheduleMonths.find((scheduleMonth) => scheduleMonth.id === month);
      if(!scheduleMonth) return null;
      monthRange.push(scheduleMonth.name);
    });
    if (monthRange.length) ruleSequence.push(monthRange.join(','));

    // Jour
    const dayRange: Array<String> = [];
    schedule.days.forEach((day) => {
      const scheduleDay = constant.scheduleDays.find((scheduleDay) => scheduleDay.id === day)
      if(!scheduleDay) return null;
      dayRange.push(scheduleDay.name);
    });
    if (dayRange.length) ruleSequence.push(dayRange.join(','));

    // Heure minute
    if (schedule.time.start && schedule.time.end) {
      ruleSequence.push(`${schedule.time.start}-${schedule.time.end}`);
    }

    // Status
    const status = constant.scheduleStatus.find((status) => status.id === schedule.time.open);
    if(!status) return null;
    ruleSequence.push(status.name);

    listRules.push(ruleSequence.join(' '));
  });

  return listRules.join(';');
}
