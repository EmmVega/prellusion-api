const { Sequelize } = require("sequelize");
const db = require("../models/");

async function connectDB() {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default connectDB;
