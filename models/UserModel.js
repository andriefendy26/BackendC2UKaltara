// import { DataTypes } from "sequelize";
// import db from "../config/database";

const { DataTypes } = require("sequelize");
const db = require("../config/database");

// const Kelurahan = require("./KelurahanModel");
// const Roles = require("./RolesModel");

const Users = db.define(
  "tb_users",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    roleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kelurahanID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

// Users.hasOne(Roles, { foreignKey: "roleID" });
// Users.hasOne(Kelurahan, { foreignKey: "kelurahanID" });

module.exports = Users;
