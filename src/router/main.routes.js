const { Router } = require("express");
const authRouter = require("./auth.routes");
const categoryRouter = require("./category.routes");
const carRouter = require("./car.routes");
const authGuard = require("../guards/auth.guard");

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use(authGuard);
mainRouter.use("/categories", categoryRouter);
mainRouter.use("/cars", carRouter);

module.exports = mainRouter;