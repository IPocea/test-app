const db = require("../models");
const Car = db.cars;
const Op = db.Sequelize.Op;
const carHelpers = require("../helpers/car.helpers");

exports.findAllPagination = async (req, res) => {
  try {
    const query = req.query;
    const paginatedResult = await carHelpers.getCarsPagination(Op, Car, query);
    return res.json(paginatedResult);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.findAll = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: {},
      order: [
        ["brand", "ASC"],
        ["model", "ASC"],
      ],
    });
    return res.json(cars);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.findOne = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({
        error: { message: ["Nu am identificat nicio masina dupa acest id"] },
      });
    }
    return res.json(car);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.create = async (req, res) => {
  try {
    const carDto = {
      brand: req.body.brand,
      model: req.body.model,
      yearOfManufacture: req.body.yearOfManufacture,
      cylindricalCapacity: req.body.cylindricalCapacity,
      taxFee: req.body.taxFee,
    };
    const newCar = await Car.create(carDto);
    return res.status(201).json(newCar);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: {
          message: error.errors.map((err) => err.message),
        },
      });
    }
    res
      .status(500)
      .json({ error: { message: ["O eroare neprevazuta a avut loc"] } });
  }
};

exports.update = async (req, res) => {
  try {
    const carId = req.params.id;
    const updateData = req.body;

    const car = await Car.findByPk(carId);

    if (!car) {
      return res.status(404).json({
        error: { message: ["Nu am identificat nicio masina dupa acest id"] },
      });
    }
    const result = await car.update(updateData);
    if (result) {
      return res.json("Masina a fost actualizata cu succes");
    } else {
      return res.status(500).json({
        error: { message: ["O eroare a intervenit in modificarea masinii"] },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: ["O eroare a intervenit in modificarea masinii"] },
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const carId = req.params.id;
    const deletedCount = await Car.destroy({
      where: { id: carId },
    });

    if (deletedCount == 1) {
      return res.json("Masina a fost stearsa cu succes");
    } else {
      return res.status(400).json({
        error: {
          message: [
            "Nu am reusit sa sterg masina cu acest id. Poate ca masina nu exista",
          ],
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: ["O eroare a intervenit in stergerea masinii"] },
    });
  }
};
