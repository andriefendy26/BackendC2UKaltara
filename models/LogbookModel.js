const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Kelurahan = require("./KelurahanModel");

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
  gambar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  kegiatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kelurahanID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// (async () => Logbook.sync({ force: true }))();
// Logbook.hasOne(Kelurahan);
Logbook.belongsTo(Kelurahan, { foreignKey: "kelurahanID" });

module.exports = Logbook;
