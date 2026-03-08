const { DataTypes } = require("sequelize");
const { sequelize } = require("../../lib/db.service");

module.exports = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
    tableName: "Categories"
});