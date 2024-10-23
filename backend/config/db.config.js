require("dotenv").config();
const { parse } = require("pg-connection-string");
const configData = parse(process.env.DATABASE_URL);

module.exports = {
  HOST: configData.host,
  USER: configData.user,
  PASSWORD: configData.password,
  DB: configData.database,
  dialect: "postgres",
  pool: {
    max: process.env.MAX,
    min: process.env.MIN,
    acquire: process.env.AQUIRE,
    idle: process.env.IDLE,
  },
};
