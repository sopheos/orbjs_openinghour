import { Schedule } from "./schedules";
/**
 * Créé une horaire au format opening_hours à partir d'une liste d'objets horaires
 * @param {Array<Schedule>} schedules
 * @returns {string | null} opening_hour si horaires valident, null sinon
 */
export declare function builder(schedules: Array<Schedule>): string | null;
