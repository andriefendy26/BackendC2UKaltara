const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Kelurahan = require("./KelurahanModel");

const Berita = db.define("tb_berita", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jenis: {
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
  kelurahanID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Berita.belongsTo(Kelurahan, { foreignKey: "kelurahanID" });

// (async () => await db.sync())();
// await db.sync();
module.exports = Berita;
