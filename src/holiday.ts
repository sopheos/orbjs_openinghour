export class Holiday {

  private paque = '';
  private lundiDePaque = '';
  private ascension = '';
  private pentecote = '';
  private vendrediSt = '';
  private nouvelleAn = '01-01';
  private feteDutravail = '05-01';
  private victoire = '05-08';
  private national = '07-14';
  private assomption = '08-15';
  private toussaint = '11-01';
  private armistice = '11-11';
  private noel = '12-25';
  private stEtienne = '12-26';

  private admins = ['FR-57',  'FR-67', 'FR-68'];

  constructor(year: number) {
    this.paque = this.getPaque(year);
    const datePaque = `${year}-${this.paque}`;
    this.lundiDePaque = this.addDay(datePaque, 1);
    this.ascension = this.addDay(datePaque, 39);
    this.pentecote = this.addDay(datePaque, 50);
    this.vendrediSt = this.addDay(datePaque, -2);
  }

  /**
   * @returns {Array<String>} Liste de jours fériés français
   */
  getHoliday(): Array<string> {
    return [
      this.paque,
      this.lundiDePaque,
      this.ascension,
      this.pentecote,
      this.nouvelleAn,
      this.feteDutravail,
      this.victoire,
      this.national,
      this.assomption,
      this.toussaint,
      this.armistice,
      this.noel
    ];
  }

  /**
   * @returns {Array<String>} Liste de jours fériés spécifiques à des départements
   */
  getOtherHoliday(): Array<string> {
    return [
      this.vendrediSt,
      this.stEtienne
    ];
  }

  /**
   * @returns {Array<String>} Liste des départements ayant des jours fériés en plus
   */
  getAdmins(): Array<string> {
    return this.admins;
  }

  /**
   * Calcul la date de Pâque à une année donné
   * https://fr.wikipedia.org/wiki/Calcul_de_la_date_de_P%C3%A2ques
   * @param {number} year
   * @returns {string} La date de Pâque au format MM-DD
   */
  getPaque(year: number): string {
    const n = year % 19;
    const c = Math.trunc(year / 100);
    const u = year % 100;
    const s = Math.trunc(c / 4);
    const t = c % 4;
    const p = Math.trunc((c + 8) / 25);
    const q = Math.trunc((c - p + 1) / 3);
    const e = (19 * n + c - s - q + 15) % 30;
    const b = Math.trunc(u / 4);
    const d = u % 4;
    const l = (2 * t + 2 * b - e - d + 32) % 7;
    const h = Math.trunc((n + 11 * e + 22 * l) / 451);
    const m = Math.trunc((e + l - 7 * h + 114) / 31);
    const j = ((e + l - 7 * h + 114) % 31) + 1;

    const day = j < 10 ? `0${j}` : j;
    return `0${m}-${day}`;
  }

  /**
   * Incrémente une date
   * @param {string} date
   * @param {number} day Nombre de jour à ajouter
   * @returns {string} La nouvelle date au format MM-DD
   */
  addDay(date: string, day: number): string {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + day);
    const daydate = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
    return `0${newDate.getMonth() + 1}-${daydate}`;
  }

}
