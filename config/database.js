const { Sequelize } = require("sequelize");
// import { Sequelize } from "sequelize";

const db = new Sequelize("c2ukaltara", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// export default db;
module.exports = db;
