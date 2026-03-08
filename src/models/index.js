const CarModel = require("./Car/Car.model");
const CategoryModel = require("./Car/Category.model");

CategoryModel.hasMany(CarModel, {foreignKey: "category_id", onDelete: "CASCADE"})
CarModel.belongsTo(CategoryModel, {foreignKey: "category_id"})

module.exports = { CarModel, CategoryModel }