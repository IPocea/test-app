const checkEmptyInputs = require("./check-empty-inputs");
const getAffectedKeyName = require("./get-affected-key-name");
const checkMinMaxNumber = require("./check-min-max-number");
const REG_EXP_PATTERNS = require("./reg-exp-patterns");
const checkIfOnlyCertainKeys = require("./check-if-only-certain-keys");
const checkIdValidity = require("./check-id-validity");

module.exports = {
  checkEmptyInputs,
  getAffectedKeyName,
  checkMinMaxNumber,
  REG_EXP_PATTERNS,
  checkIfOnlyCertainKeys,
  checkIdValidity,
};
