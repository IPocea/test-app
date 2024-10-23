const db = require("../models");
const Car = db.cars;
const {
  checkEmptyInputs,
  getAffectedKeyName,
  checkMinMaxNumber,
  checkIfOnlyCertainKeys,
  checkIdValidity,
} = require("../utils");

verifyEmptyInputs = (req, res, next) => {
  const payload = {
    brand: req.body.brand,
    model: req.body.model,
    yearOfManufacture: req.body.yearOfManufacture,
    cylindricalCapacity: req.body.cylindricalCapacity,
    taxFee: req.body.taxFee,
  };
  const checkEmptyInputsResult = checkEmptyInputs(payload);
  if (checkEmptyInputsResult.hasEmptyInputs) {
    return res.status(400).send({
      message: `Campul ${getAffectedKeyName(
        checkEmptyInputsResult.emptyKey
      )} este obligatoriu`,
    });
  }

  next();
};

verifyMinMaxNumber = (req, res, next) => {
  const payload1 = {
    yearOfManufacture: req.body.yearOfManufacture,
  };
  const checkMinMaxNumberResult1 = checkMinMaxNumber(payload1, [1886, 9999]);
  if (checkMinMaxNumberResult1.hasError) {
    return res.status(400).send({
      error: {
        message: [
          `Formatul campului ${getAffectedKeyName(
            checkMinMaxNumberResult1.affectedKey
          )} este invalid`,
        ],
      },
    });
  }
  const payload2 = {
    cylindricalCapacity: req.body.cylindricalCapacity,
    taxFee: req.body.taxFee,
  };
  const checkMinMaxNumberResult2 = checkMinMaxNumber(payload2, [null, 9999]);
  if (checkMinMaxNumberResult2.hasError) {
    return res.status(400).send({
      error: {
        message: [
          `Formatul campului ${getAffectedKeyName(
            checkMinMaxNumberResult2.affectedKey
          )} este invalid`,
        ],
      },
    });
  }
  next();
};

verifyIfBodyHaveCorrectKeys = (req, res, next) => {
  const hasError = checkIfOnlyCertainKeys(req.body, [
    "brand",
    "model",
    "yearOfManufacture",
    "cylindricalCapacity",
    "taxFee",
  ]);
  if (hasError) {
    return res.status(400).send({
      error: {
        message: ["Campuri lipsa sau neautorizate"],
      },
    });
  }
  next();
};

verifyIdValidity = (req, res, next) => {
  const id = +req.params.id;
  const result = checkIdValidity(id);
  if (result) {
    return res.status(400).send({
      error: {
        message: ["Id-ul este invalid"],
      },
    });
  }

  next();
};

const carMiddleware = {
  verifyEmptyInputs,
  verifyMinMaxNumber,
  verifyIfBodyHaveCorrectKeys,
  verifyIdValidity,
};

module.exports = carMiddleware;
