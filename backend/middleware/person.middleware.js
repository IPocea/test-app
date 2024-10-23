const db = require("../models");
const Person = db.persons;
const {
  checkEmptyInputs,
  getAffectedKeyName,
  checkMinMaxNumber,
  REG_EXP_PATTERNS,
  checkIdValidity,
  checkIfOnlyCertainKeys,
} = require("../utils");

verifyEmptyInputs = (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    CNP: req.body.CNP,
    age: req.body.age,
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
  if (req.body.CNP.length !== 13)
    return res.status(400).send({
      error: {
        message: ["CNP-u este invalid"],
      },
    });

  const payload2 = {
    age: req.body.age,
  };
  const checkMinMaxNumberResult2 = checkMinMaxNumber(payload2, [1, 200]);
  if (checkMinMaxNumberResult2.hasError) {
    return res.status(400).send({
      error: {
        message: ["Varsta este invalida"],
      },
    });
  }
  next();
};

verifyIfBodyHaveCorrectKeys = (req, res, next) => {
  const hasError = checkIfOnlyCertainKeys(req.body, [
    "firstName",
    "lastName",
    "CNP",
    "age",
    "carIds",
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

verifyCarIds = (req, res, next) => {
  const carIds = req.body.carIds;
  if (!Array.isArray(carIds)) {
    return res.status(400).send({
      error: {
        message: ["Campul carIds trebuie sa fie un array"],
      },
    });
  }

  let hasError = false;
  for (const id of carIds) {
    if (isNaN(+id)) {
      hasError = true;
      break;
    }
  }

  if (hasError) {
    return res.status(400).send({
      error: {
        message: ["Unul sau mai multe id-uri de masina sunt invalide"],
      },
    });
  }
  next();
};

verifyIfCNPIsUnique = async (req, res, next) => {
  const CNP = req.body.CNP;
  const existingPerson = await Person.findOne({ where: { CNP } });
  if (existingPerson) {
    return res.status(400).send({
      message: ["CNP-ul este deja in folosinta"],
    });
  }

  next();
};

verifyIfCNPIsUniqueOnUpdate = async (req, res, next) => {
  const personId = req.params.id;
  const person = await Person.findByPk(personId);
  const mewCNP = req.body.CNP;
  const initialPersonData = person.get({ plain: true });
  if (initialPersonData.CNP !== mewCNP) {
    const existingPerson = await Person.findOne({
      where: { CNP: mewCNP },
    });
    if (existingPerson) {
      return res.status(400).send({
        message: ["CNP-ul este deja in folosinta"],
      });
    }
  }

  next();
};

verifyIfCNPHaveOnlyDigits = (req, res, next) => {
  const CNP = req.body.CNP;
  const pattern = REG_EXP_PATTERNS.checkIfHasNumbersOnlyPattern;
  if (!pattern.test(CNP)) {
    return res.status(400).send({
      error: {
        message: ["CNP-u este invalid"],
      },
    });
  }
  next();
};

verifyIfNamesHaveDigits = (req, res, next) => {
  const pattern = REG_EXP_PATTERNS.checkIfHasDigitsPattern;
  if (pattern.test(req.body.firstName || pattern.test(req.body.lastName))) {
    return res.status(400).send({
      message: ["Numele si prenumele nu pot contine cifre"],
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

const personMiddleware = {
  verifyEmptyInputs,
  verifyMinMaxNumber,
  verifyIfNamesHaveDigits,
  verifyCarIds,
  verifyIfCNPIsUnique,
  verifyIfCNPIsUniqueOnUpdate,
  verifyIdValidity,
  verifyIfCNPHaveOnlyDigits,
  verifyIfBodyHaveCorrectKeys,
};

module.exports = personMiddleware;
