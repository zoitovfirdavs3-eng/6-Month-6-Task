const { DataTypes } = require("sequelize");
const { sequelize } = require("../../lib/db.service");

module.exports = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    carname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    car_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    car_transmission_type: {
        type: DataTypes.ENUM,
        values: ["manual", "automat"]
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Cars",
    timestamps: true
});