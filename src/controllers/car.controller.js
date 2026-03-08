const { globalError, ClientError } = require("shokhijakhon-error-handler");
const carValidator = require("../utils/validators/car.validator");
const { CarModel, CategoryModel } = require("../models");

module.exports = {
  async CREATE_CAR(req, res) {
    try {
      let newCar = req.body;
      await carValidator.validateAsync(newCar, { abortEarly: false });
      let findCategory = await CategoryModel.findByPk(newCar.category_id);
      if (!findCategory) throw new ClientError("Category not found", 404);
      if (req.filename) {
        req.files.car_image.mv(
          path.join(process.cwd(), "uploads", "carPhotos", req.filename),
        );
      }
      let insertCar = await CarModel.create(newCar);
      return res.status(201).json({
        message: "Car successfully created !",
        status: 201,
        id: insertCar.id,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async GET_CARS(req, res) {
    try {
      let cars = await CarModel.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt", "category_id"]
        },
        include: {
          model: CategoryModel,
          attributes: ["category_name"],
        },
      });
      return res.json(cars);
    } catch (err) {
      return globalError(err, res);
    }
  },
  async GET_CAR(req, res) {
    try {
      let { id } = req.params;
      const findCar = await CarModel.findByPk(id, {
        attributes: {
            exclude: ["createdAt", "updatedAt", "category_id"]
        },
        include: {
          model: CategoryModel,
          attributes: ["category_name"],
        },
      });
      if (!findCar) throw new ClientError("Car not found", 404);
      return res.json(findCar);
    } catch (err) {
      return globalError(err, res);
    }
  },
  async REMOVE_CAR(req, res) {
    try {
      const { id } = req.params;
      const findCar = await CarModel.findByPk(id);
      if (!findCar) throw new ClientError("Car not found", 404);
      await findCar.destroy();
      return res.json({ message: "Car successfully deleted", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async UPDATE_CAR(req, res) {
    try {
      const { id } = req.params;
      const findCar = await CarModel.findByPk(id);
      if (!findCar) throw new ClientError("Car not found", 404);
      let updateData = req.body;
      await findCar.update(updateData);
      return res.json({ message: "Car successfully updated", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  },
};
