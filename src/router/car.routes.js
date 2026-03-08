const { Router } = require("express");
const carController = require("../controllers/car.controller");
const carPhotoGuard = require("../guards/car-photo.guard");

const carRouter = Router();

carRouter.post("/create", carPhotoGuard, carController.CREATE_CAR);
carRouter.get("/all", carController.GET_CARS);
carRouter
  .route("/:id")
  .get(carController.GET_CAR)
  .put(carController.UPDATE_CAR)
  .delete(carController.REMOVE_CAR);

module.exports = carRouter;
