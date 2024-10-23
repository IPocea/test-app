module.exports = (app) => {
  const { carMiddleware } = require("../middleware/index");
  const carController = require("../controllers/car.controller");

  let router = require("express").Router();

  router.get("/find-all", carController.findAll);

  router.get("/find-all-pagination", carController.findAllPagination);

  router.get(
    "/:id/find-one",
    [carMiddleware.verifyIdValidity],
    carController.findOne
  );

  router.post(
    "/add",
    [
      carMiddleware.verifyEmptyInputs,
      carMiddleware.verifyIfBodyHaveCorrectKeys,
      carMiddleware.verifyMinMaxNumber,
    ],
    carController.create
  );

  router.put(
    "/:id/edit",
    [
      carMiddleware.verifyIdValidity,
      carMiddleware.verifyEmptyInputs,
      carMiddleware.verifyIfBodyHaveCorrectKeys,
      carMiddleware.verifyMinMaxNumber,
    ],
    carController.update
  );

  router.delete(
    "/:id/delete",
    [carMiddleware.verifyIdValidity],
    carController.delete
  );

  app.use("/api/cars", router);
};
