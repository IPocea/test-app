const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cars = require("./car.js")(sequelize, Sequelize);
db.persons = require("./person.js")(sequelize, Sequelize);
db.personCars = require("./person-cars.js")(sequelize, Sequelize);

db.cars.belongsToMany(db.persons, {
  through: "person_cars",
  foreignKey: {
    name: "id_car",
    onDelete: "CASCADE",
  },
  otherKey: "id_person",
});

db.persons.belongsToMany(db.cars, {
  through: "person_cars",
  foreignKey: {
    name: "id_person",
    onDelete: "CASCADE",
  },
  otherKey: "id_car",
  onDelete: "CASCADE",
});

module.exports = db;
