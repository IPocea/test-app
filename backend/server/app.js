const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("../models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Database connection successfully.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to test application." });
});

require("../routes/car.route")(app);
require("../routes/person.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
