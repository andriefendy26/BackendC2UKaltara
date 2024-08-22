
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Roles = db.define("tb_roles", {
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Roles;
