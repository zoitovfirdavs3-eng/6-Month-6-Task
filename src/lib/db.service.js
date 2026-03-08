const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "postgres",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    logging: false
});

async function dbConnection(){
    try{
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log(`DB successfully connected !`);
    }catch(err){
        console.log(`DB connection error: ${err.message}`);
        throw new Error(`DB connection error: ${err.message}`);
    }
};

module.exports = { sequelize, dbConnection };