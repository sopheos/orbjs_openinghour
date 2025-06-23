export interface Schedule {
    days: Array<number>;
    months: Array<number>;
    period: {
        start: string | null;
        end: string | null;
        repeat: boolean | null;
    };
    time: {
        open: number;
        start: string | null;
        end: string | null;
    };
    type: number;
}
export declare class Schedules {
    private listHoliday;
    private listOtherHoliday;
    private listAdmins;
    private schedules;
    private admin;
    private date;
    private dayIndex;
    private dayKey;
    private monthIndex;
    private monthKey;
    constructor(schedules: Array<Schedule>, currentDate: string, admin?: string | null);
    /**
      * Retourne l'état actuelle de l'horaires ainsi que la liste des horaires correspondant au jour renseigné
      * @param {number} size Length of the preview (7 day by default)
      * @returns {Object}
      */
    getPreview(size?: number): Object;
    /**
     * Consecutive days with the same schedule are grouped
     * (public holidays are not grouped unless is schedules is the same as the other day of the week)
     */
    concatWeek(week: Array<Array<Object> | null> | null): Array<Object> | null;
    /**
     * Consecutive months with the same schedule are grouped
     */
    concatMonths(months: Array<Array<Array<Object> | null>>): Array<Object>;
    /**
     * Transform periods object in array
     */
    concatPeriods(periods: any): Array<Object>;
    /**
     * Sort by day
     * @param {Array} week
     * @param {Schedule} schedule
     */
    sortWeek(week: Array<Array<Object> | null>, schedule: Schedule): void;
    /**
     * @returns All schedules in a concatenated format
     */
    getConcat(): Object;
}
