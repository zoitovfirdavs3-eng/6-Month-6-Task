const { DataTypes } = require("sequelize");
const { sequelize } = require("../../lib/db.service");

module.exports = sequelize.define('User', {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING
    },
    otpTime: {
        type: DataTypes.DATE
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    refresh_token: {
        type: DataTypes.STRING,
        defaultValue: null
    }
}, {
    tableName: "Users",
    timestamps: true
});