module.exports = (app) => {
  const { personMiddleware } = require("../middleware/index");
  const personController = require("../controllers/person.controller");

  let router = require("express").Router();

  router.get("/find-all-pagination", personController.findAllPagination);

  router.get(
    "/:id/find-one",
    [personMiddleware.verifyIdValidity],
    personController.findOne
  );

  router.post(
    "/add",
    [
      personMiddleware.verifyEmptyInputs,
      personMiddleware.verifyIfBodyHaveCorrectKeys,
      personMiddleware.verifyMinMaxNumber,
      personMiddleware.verifyCarIds,
      personMiddleware.verifyIfCNPIsUnique,
      personMiddleware.verifyIfCNPHaveOnlyDigits,
      personMiddleware.verifyIfNamesHaveDigits,
    ],
    personController.create
  );

  router.put(
    "/:id/edit",
    [
      personMiddleware.verifyIdValidity,
      personMiddleware.verifyEmptyInputs,
      personMiddleware.verifyMinMaxNumber,
      personMiddleware.verifyIfBodyHaveCorrectKeys,
      personMiddleware.verifyIfCNPIsUniqueOnUpdate,
      personMiddleware.verifyCarIds,
      personMiddleware.verifyIfCNPHaveOnlyDigits,
      personMiddleware.verifyIfNamesHaveDigits,
    ],
    personController.update
  );

  router.delete(
    "/:id/delete",
    [personMiddleware.verifyIdValidity],
    personController.delete
  );

  app.use("/api/persons", router);
};
