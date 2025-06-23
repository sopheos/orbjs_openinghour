export declare class Holiday {
    private paque;
    private lundiDePaque;
    private ascension;
    private pentecote;
    private vendrediSt;
    private nouvelleAn;
    private feteDutravail;
    private victoire;
    private national;
    private assomption;
    private toussaint;
    private armistice;
    private noel;
    private stEtienne;
    private admins;
    constructor(year: number);
    /**
     * @returns {Array<String>} Liste de jours fériés français
     */
    getHoliday(): Array<string>;
    /**
     * @returns {Array<String>} Liste de jours fériés spécifiques à des départements
     */
    getOtherHoliday(): Array<string>;
    /**
     * @returns {Array<String>} Liste des départements ayant des jours fériés en plus
     */
    getAdmins(): Array<string>;
    /**
     * Calcul la date de Pâque à une année donné
     * https://fr.wikipedia.org/wiki/Calcul_de_la_date_de_P%C3%A2ques
     * @param {number} year
     * @returns {string} La date de Pâque au format MM-DD
     */
    getPaque(year: number): string;
    /**
     * Incrémente une date
     * @param {string} date
     * @param {number} day Nombre de jour à ajouter
     * @returns {string} La nouvelle date au format MM-DD
     */
    addDay(date: string, day: number): string;
}
