import { Holiday } from "./holiday";

export interface Schedule {
  days: Array<number>;
  months: Array<number>;
  period: { start: string | null, end: string | null, repeat: boolean | null },
  time: { open: number, start: string | null, end: string | null },
  type: number,
}

export class Schedules {

  private listHoliday: Array<String> = [];
  private listOtherHoliday: Array<String> = [];
  private listAdmins: Array<String> = [];

  private schedules: Array<Schedule> = [];
  private admin: string | null = null;

  private date: Date;

  private dayIndex: Array<number> = [6, 0, 1, 2, 3, 4, 5, 7];
  private dayKey: Array<number> = [1, 2, 3, 4, 5, 6, 0, 7];
  
  private monthIndex: Array<number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  private monthKey: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(schedules: Array<Schedule>, currentDate: string, admin: string | null = null) {
    this.schedules = schedules;
    this.date = new Date(currentDate);
    this.admin = admin;

    const holiday = new Holiday(this.date.getFullYear());
    this.listHoliday = holiday.getHoliday();
    this.listOtherHoliday = holiday.getOtherHoliday();
    this.listAdmins = holiday.getAdmins();
  }

  /**
    * Retourne l'état actuelle de l'horaires ainsi que la liste des horaires correspondant au jour renseigné
    * @param {number} size Length of the preview (7 day by default)
    * @returns {Object}
    */
  getPreview(size: number = 7): Object {
    if (!size) return {};

    const weekData = new Array(size);
    const preview = new Array(size);

    const date = new Date(this.date);
    date.setHours(0, 0, 0, 0);

    for (let index = 0; index < size; index++) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayWeek = date.getDay();
      weekData[index] = {
        type: 0,
        date: new Date(date),
        strDate: `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`,
        month,
        dayWeek,
      };     
      preview[index] = {
        day: dayWeek,
        times: [],
      };
      date.setDate(date.getDate() + 1);
    }

    let isOpen = null;
    let currentType = null;

    const isFr = this.admin ? this.admin.split('-')[0] === 'FR' : false
    for (let i = 0; i < this.schedules.length; i += 1) {
      const schedule: Schedule = this.schedules[i];

      let scheduleType = schedule.type === 2 && !schedule.period.repeat ? 10 : schedule.type;

      const periodStart = new Date(schedule.period.start ?? 0);
      periodStart.setHours(0, 0, 0, 0);
      const periodEnd = new Date(schedule.period.end ?? 0);
      periodEnd.setHours(23, 59, 59, 999);


      for (let index = 0; index < weekData.length; index++) {
        // Periods or Months
        if (schedule.type === 2) {
          if (weekData[index].date < periodStart || weekData[index].date > periodEnd) {
            continue;
          }
        } else if (schedule.type === 1 && !schedule.months.includes(weekData[index].month)) {
          continue;
        }

        // Days
        if (!schedule.days.includes(weekData[index].dayWeek)) {
          if (schedule.days.some((dayId) => dayId === 7) && isFr) {
            if (!this.listHoliday.includes(weekData[index].strDate)) {
              if (!this.admin || !this.listAdmins.includes(this.admin) || !this.listOtherHoliday.includes(weekData[index].strDate)) {
                continue;
              }
            }
          } else {
            continue;
          }
        }

        // Time
        if (scheduleType >= weekData[index].type) {
          const start = schedule.time.start;
          const end = schedule.time.end;
          const open = !!schedule.time.open;

          // Today state
          let scheduleIsOpen = null;
          if (index === 0) {
            const hour = this.date.getHours();
            const minute = this.date.getMinutes();
            const strHour = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
            if (start && end) {
                if (start <= strHour && strHour < end){
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
          if (scheduleType === weekData[index].type) {
            preview[index].times.push({
              open,
              start,
              end
            });
            if (index === 0) {
              isOpen = isOpen ?? scheduleIsOpen;
            }
          } else if (scheduleType > weekData[index].type) {
            weekData[index].type = scheduleType;
            preview[index].times = [{
              open,
              start,
              end
            }];
            if (index === 0) {
              isOpen = scheduleIsOpen;
            }
          }
        }
      }
    }

    return {
      isOpen,
      type: currentType,
      preview,
    };
  }

  /**
   * Consecutive days with the same schedule are grouped 
   * (public holidays are not grouped unless is schedules is the same as the other day of the week)
   */
  concatWeek(week: Array<Array<Object> | null> | null): Array<Object> | null {
    const concatWeek: Array<object> = [];
    let start: number | null = null;
    let prevHash: string | null = null;
    let prevKey: number | null = null;
    let prevTime: Array<Object> | null = null;
    let listDays: Array<number> = [];

    week?.forEach((times: any, index) => {
      const key = this.dayKey[index];

      const hash: string = JSON.stringify(times);
      const endArray = week.length - 1 === index;
      const notSame = (prevHash && prevHash !== hash);

      if (start === null) {
        start = key;
      } else if (notSame || endArray) {
        const notAllDay = key === 7 && (notSame || start !== 1);
        let end: number | null = notSame || notAllDay ? prevKey : key;

        if (!notSame) {
          listDays.push(key);
        }
        
        concatWeek.push({
          days: listDays,
          start,
          end: end !== start ? end : null,
          times: prevTime
        })

        start = key;
        listDays = [];

        if (notAllDay) {
          concatWeek.push({
            days: [start],
            start,
            end: null,
            times,
          })
        }
      } 

      prevHash = hash;
      prevKey = key;
      prevTime = times;
      listDays.push(key);
    })

    return concatWeek.length ? concatWeek : null;
  }

  /**
   * Consecutive months with the same schedule are grouped
   */
  concatMonths(months: Array<Array<Array<Object> | null>>): Array<Object> {
    const concatMonths: Array<object> = [];
    let start: number | null = null;
    let prevHash: string | null = null;
    let prevKey: number | null = null;
    let prevWeek: Array<Array<Object> | null> | null = null;
    let listMonths: Array<number> = [];

    months.forEach((week: any, index) => {
      const key = this.monthKey[index];
      const hash: string = JSON.stringify(week);
      const endArray = months.length - 1 === index;
      const notSame = (prevHash && prevHash !== hash);

      if (start === null) {
        start = key;
      } else if (notSame || endArray) {
        const end = notSame ? prevKey : key;
        if (!notSame) {
          listMonths.push(key);
        }
  
        concatMonths.push({
          start,
          end: end !== start ? end : null,
          months: listMonths,
          week: this.concatWeek(prevWeek)
        })

        start = key;
        listMonths = [];

        if (notSame && endArray) {
          concatMonths.push({
            start,
            end: null,
            months: [start],
            week: this.concatWeek(week)
          })
        }
      } 

      prevHash = hash;
      prevKey = key;
      prevWeek = week;
      listMonths.push(key);
    })

    return concatMonths;
  }

  /**
   * Transform periods object in array 
   */
  concatPeriods(periods: any): Array<Object> {
    const ctx = this;
    return Object.keys(periods)
      .map((key) => {
        const { start, end, repeat, week } = periods[key];
        return {
          start,
          end: end !== start ? end : null,
          repeat,
          week: ctx.concatWeek(week)
        };
      });
  }

  /**
   * Sort by day
   * @param {Array} week 
   * @param {Schedule} schedule 
   */
  sortWeek(week: Array<Array<Object> | null>, schedule: Schedule): void {
    schedule.days.forEach((day) => {
      const index = this.dayIndex[day];
      const weekDay = week[index];
      const result = { ...schedule.time , open: !!schedule.time.open}
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
  getConcat(): Object {
    const globalWeek = new Array(8).fill(null);
    const months = new Array(12).fill(null);
    const periods: any = {};

    this.schedules.forEach((schedule) => {
      switch (schedule.type) {
        case 0:
          this.sortWeek(globalWeek, schedule);
          break;
        case 1:
          // Sort by month
          schedule.months.forEach((month) => {
            const index = this.monthIndex[month];
            let week = months[index];
            if (!week) {
              week = new Array(8).fill(null);
              months[index] = week;
            }
            this.sortWeek(week, schedule);
          });
          break;
        case 2:
          // Sort by periods
          const {start, end, repeat} = schedule.period;
          const period = `${repeat}_${start}_${end}`;

          let week = periods[period]?.week;
          if (!week) {
            week = new Array(8).fill(null);
            periods[period] = {
              start,
              end,
              repeat,
              week
            };
          }
          this.sortWeek(week, schedule);
          break;
        default:
          break;
      }
    });

    return {
      global: this.concatWeek(globalWeek),
      months: this.concatMonths(months),
      periods: this.concatPeriods(periods),
    };
  }
}
