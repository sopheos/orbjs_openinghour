import * as constant from "./constant";
import { Schedule } from "./schedules";

const isRuleModifier = /^(open|closed)$/;
const isTime = /^(([01][0-9])|(2[0-3])):[0-5][0-9]-(([01][0-9])|(2[0-3])):[0-5][0-9]$/;
const isWeekDay = /^((Mo|Tu|We|Th|Fr|Sa|Su|PH),?)+$/;
const isMonth = /^((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?)+$/;

/**
 * Créé une liste d'objets horaires à partir du format opening_hour
 * @param {string} oh oh
 * @param {string | null} date date utilisé pour les périodes répétable, celle du device par défauts
 * @returns une liste d'horaires si opening_hour valide, null sinon
 */
export function parser(oh: string, date: string | null): Array<Schedule> | null {
  const currentDate = date ? new Date(date) : new Date();
  const schedules: Array<Schedule> = [];
  const listRules = oh.split(';');
  listRules.forEach((ruleSequence) => {
    const schedule: Schedule = {
      days: [],
      months: [],
      period: { start: null, end: null, repeat: null },
      time: { open: 0, start: null, end: null },
      type: 0,
    };

    const parts = ruleSequence.split(' ');
    let index = parts.length - 1;

    // Status
    if (index >= 0 && isRuleModifier.test(parts[index])) {
      const status = constant.scheduleStatus.find((status) => status.name === parts[index]);
      if (!status) return null;
      schedule.time.open = status.id;
      index -= 1;
    }

    // Heure minute
    if (index >= 0 && isTime.test(parts[index])) {
      const listTimes = parts[index].split('-');
      schedule.time.start = listTimes[0];
      schedule.time.end = listTimes[1];
      index -= 1;
    }

    // Jour
    if (index >= 0 && isWeekDay.test(parts[index])) {
      const listDay = parts[index].split(',');
      listDay.forEach((day) => {
        const scheduleDay = constant.scheduleDays.find((scheduleDay) => scheduleDay.name === day);
        if (!scheduleDay) return null;
        schedule.days.push(scheduleDay.id);
      });
      index -= 1;
    }

    // Mois
    if (index >= 0 && isMonth.test(parts[index])) {
      schedule.type = 1;
      const listMonths = parts[index].split(',');
      listMonths.forEach((month) => {
        const scheduleMonth = constant.scheduleMonths.find((scheduleMonth) => scheduleMonth.name === month);
        if (!scheduleMonth) return null;
        schedule.months.push(scheduleMonth.id);
      });
      index -= 1;
    }

    // Période
    if (index >= 0) {
      schedule.type = 2;
      if (index === 4) {
        parts.splice(0, 0, `${currentDate.getFullYear()}`);
        parts.splice(4, 0, `${currentDate.getFullYear()}`);
        schedule.period.repeat = true;
      } else {
        schedule.period.repeat = false;
      }

      const monthStart = constant.scheduleMonths.find((scheduleMonth) => scheduleMonth.name === parts[1]);
      if (!monthStart) return null;
      let strStart = monthStart.id < 10 ? `0${monthStart.id}` : monthStart.id;

      const monthEnd = constant.scheduleMonths.find((scheduleMonth) => scheduleMonth.name === parts[5]);
      if (!monthEnd) return null;
      let strEnd = monthEnd.id < 10 ? `0${monthEnd.id}` : monthEnd.id;

      const startDate = `${strStart}-${parts[2]}`;
      const endDate = `${strEnd}-${parts[6]}`;
      if (startDate > endDate) {
        parts[4] = `${currentDate.getFullYear() + 1}`;
      }
      
      schedule.period.start = `${parts[0]}-${startDate}`;
      schedule.period.end = `${parts[4]}-${endDate}`;
    }
    schedules.push(schedule);
  });
  return schedules;
}
