import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
export var Holiday = /*#__PURE__*/function () {
  function Holiday(year) {
    _classCallCheck(this, Holiday);
    _defineProperty(this, "paque", '');
    _defineProperty(this, "lundiDePaque", '');
    _defineProperty(this, "ascension", '');
    _defineProperty(this, "pentecote", '');
    _defineProperty(this, "vendrediSt", '');
    _defineProperty(this, "nouvelleAn", '01-01');
    _defineProperty(this, "feteDutravail", '05-01');
    _defineProperty(this, "victoire", '05-08');
    _defineProperty(this, "national", '07-14');
    _defineProperty(this, "assomption", '08-15');
    _defineProperty(this, "toussaint", '11-01');
    _defineProperty(this, "armistice", '11-11');
    _defineProperty(this, "noel", '12-25');
    _defineProperty(this, "stEtienne", '12-26');
    _defineProperty(this, "admins", ['FR-57', 'FR-67', 'FR-68']);
    this.paque = this.getPaque(year);
    var datePaque = "".concat(year, "-").concat(this.paque);
    this.lundiDePaque = this.addDay(datePaque, 1);
    this.ascension = this.addDay(datePaque, 39);
    this.pentecote = this.addDay(datePaque, 50);
    this.vendrediSt = this.addDay(datePaque, -2);
  }

  /**
   * @returns {Array<String>} Liste de jours fériés français
   */
  return _createClass(Holiday, [{
    key: "getHoliday",
    value: function getHoliday() {
      return [this.paque, this.lundiDePaque, this.ascension, this.pentecote, this.nouvelleAn, this.feteDutravail, this.victoire, this.national, this.assomption, this.toussaint, this.armistice, this.noel];
    }

    /**
     * @returns {Array<String>} Liste de jours fériés spécifiques à des départements
     */
  }, {
    key: "getOtherHoliday",
    value: function getOtherHoliday() {
      return [this.vendrediSt, this.stEtienne];
    }

    /**
     * @returns {Array<String>} Liste des départements ayant des jours fériés en plus
     */
  }, {
    key: "getAdmins",
    value: function getAdmins() {
      return this.admins;
    }

    /**
     * Calcul la date de Pâque à une année donné
     * https://fr.wikipedia.org/wiki/Calcul_de_la_date_de_P%C3%A2ques
     * @param {number} year
     * @returns {string} La date de Pâque au format MM-DD
     */
  }, {
    key: "getPaque",
    value: function getPaque(year) {
      var n = year % 19;
      var c = Math.trunc(year / 100);
      var u = year % 100;
      var s = Math.trunc(c / 4);
      var t = c % 4;
      var p = Math.trunc((c + 8) / 25);
      var q = Math.trunc((c - p + 1) / 3);
      var e = (19 * n + c - s - q + 15) % 30;
      var b = Math.trunc(u / 4);
      var d = u % 4;
      var l = (2 * t + 2 * b - e - d + 32) % 7;
      var h = Math.trunc((n + 11 * e + 22 * l) / 451);
      var m = Math.trunc((e + l - 7 * h + 114) / 31);
      var j = (e + l - 7 * h + 114) % 31 + 1;
      var day = j < 10 ? "0".concat(j) : j;
      return "0".concat(m, "-").concat(day);
    }

    /**
     * Incrémente une date
     * @param {string} date
     * @param {number} day Nombre de jour à ajouter
     * @returns {string} La nouvelle date au format MM-DD
     */
  }, {
    key: "addDay",
    value: function addDay(date, day) {
      var newDate = new Date(date);
      newDate.setDate(newDate.getDate() + day);
      var daydate = newDate.getDate() < 10 ? "0".concat(newDate.getDate()) : newDate.getDate();
      return "0".concat(newDate.getMonth() + 1, "-").concat(daydate);
    }
  }]);
}();
//# sourceMappingURL=holiday.js.map