const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Kelurahan = db.define(
  "tb_kelurahan",
  {
    namaKelurahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Kelurahan;
