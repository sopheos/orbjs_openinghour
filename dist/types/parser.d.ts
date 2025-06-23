import { Schedule } from "./schedules";
/**
 * Créé une liste d'objets horaires à partir du format opening_hour
 * @param {string} oh oh
 * @param {string | null} date date utilisé pour les périodes répétable, celle du device par défauts
 * @returns une liste d'horaires si opening_hour valide, null sinon
 */
export declare function parser(oh: string, date: string | null): Array<Schedule> | null;
