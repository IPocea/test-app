const db = require("../models");
const Person = db.persons;
const Car = db.cars;
const PersonCars = db.personCars;
const Op = db.Sequelize.Op;
const personHelpers = require("../helpers/person.helpers");

exports.findAllPagination = async (req, res) => {
  try {
    const query = req.query;
    const paginatedResult = await personHelpers.getPersonsPagination(
      Op,
      Person,
      Car,
      query
    );
    return res.json(paginatedResult);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.findOne = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id, {
      include: [
        {
          model: Car,
          as: "cars",
          through: { attributes: [] },
        },
      ],
    });
    if (!person) {
      return res.status(404).json({
        error: { message: ["Nu am identificat nicio persoana dupa acest id"] },
      });
    }
    return res.json(person);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const personDto = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      CNP: req.body.CNP,
      age: +req.body.age,
    };

    const newPerson = await Person.create(personDto, { transaction: t });
    const newPersonCarsDto = [];
    const carIds = req.body.carIds;
    if (carIds && carIds.length && newPerson?.dataValues?.id) {
      for (const id of carIds) {
        newPersonCarsDto.push({
          id_person: newPerson.dataValues?.id,
          id_car: id,
        });
      }
      console.log(newPersonCarsDto);
      await PersonCars.bulkCreate(newPersonCarsDto, { transaction: t });
    }
    await t.commit();
    return res.status(201).json(newPerson);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: {
          message: error.errors.map((err) => err.message),
        },
      });
    }
    res.status(500).json({ error: ["O eroare neprevazuta a avut loc"] });
  }
};

exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const personId = req.params.id;
    const updateData = req.body;
    const carIds = updateData.carIds;
    delete updateData.carIds;
    const person = await Person.findByPk(personId, {
      include: [
        {
          model: Car,
          as: "cars",
        },
      ],
    });
    if (!person) {
      return res.status(404).json({
        error: { message: ["Nu am identificat nicio masina dupa acest id"] },
      });
    }
    const initialPersonData = person.get({ plain: true });
    const { carsToAdd, carsToRemove } = personHelpers.getCarsToAddAndToRemove(
      initialPersonData,
      carIds
    );
    const updatedPerson = await person.update(updateData, { transaction: t });
    if (carsToAdd && carsToAdd.length) {
      const newPersonCarsDto = [];
      for (const id of carsToAdd) {
        newPersonCarsDto.push({
          id_person: initialPersonData.id,
          id_car: id,
        });
      }
      await PersonCars.bulkCreate(newPersonCarsDto, { transaction: t });
    }
    if (carsToRemove.length) {
      await updatedPerson.removeCars(carsToRemove, { transaction: t });
    }
    await t.commit();
    return res.json("Masina a fost actualizata cu succes");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: ["O eroare a intervenit in modificarea masinii"] },
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const personId = req.params.id;
    const deletedCount = await Person.destroy({
      where: { id: personId },
    });

    if (deletedCount == 1) {
      return res.json("Persoana a fost stearsa cu succes");
    } else {
      return res.status(400).json({
        error: {
          message: [
            "Nu am reusit sa sterg Persoana cu acest id. Poate ca Persoana nu exista",
          ],
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: ["O eroare a intervenit in stergerea persoanei"] },
    });
  }
};
