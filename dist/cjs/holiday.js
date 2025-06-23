"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Holiday = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var Holiday = exports.Holiday = /*#__PURE__*/function () {
  function Holiday(year) {
    (0, _classCallCheck2.default)(this, Holiday);
    (0, _defineProperty2.default)(this, "paque", '');
    (0, _defineProperty2.default)(this, "lundiDePaque", '');
    (0, _defineProperty2.default)(this, "ascension", '');
    (0, _defineProperty2.default)(this, "pentecote", '');
    (0, _defineProperty2.default)(this, "vendrediSt", '');
    (0, _defineProperty2.default)(this, "nouvelleAn", '01-01');
    (0, _defineProperty2.default)(this, "feteDutravail", '05-01');
    (0, _defineProperty2.default)(this, "victoire", '05-08');
    (0, _defineProperty2.default)(this, "national", '07-14');
    (0, _defineProperty2.default)(this, "assomption", '08-15');
    (0, _defineProperty2.default)(this, "toussaint", '11-01');
    (0, _defineProperty2.default)(this, "armistice", '11-11');
    (0, _defineProperty2.default)(this, "noel", '12-25');
    (0, _defineProperty2.default)(this, "stEtienne", '12-26');
    (0, _defineProperty2.default)(this, "admins", ['FR-57', 'FR-67', 'FR-68']);
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
  return (0, _createClass2.default)(Holiday, [{
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