const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Logbook = db.define("tb_logbook", {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  npm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jurusan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  kegiatan: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Logbook;
