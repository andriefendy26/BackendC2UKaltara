const Logbook = require("../models/LogbookModel");
const moment = require("moment-timezone");

const getLogbook = async (req, res) => {
  const data = await Logbook.findAll();
  return res.status(200).json({ status: "success", data: data });
};

const getLogbookByid = async (req, res) => {
  const data = await Logbook.findOne({ where: { id: req.params.id } });

  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  return res.status(200).json({ status: "success", data: data });
};

const createLogbook = async (req, res) => {
  const { nama, npm, jurusan, kegiatan, kelurahanID } = req.body;
  const date = moment().tz("Asia/Makassar").format("YYYY-MM-DD");

  if (
    nama == "" ||
    npm == "" ||
    jurusan == "" ||
    kegiatan == "" ||
    kelurahanID == ""
  ) {
    return res.status(401).json({ msg: "pastikan semua kolom terisi" });
  } else {
    try {
      await Logbook.create({
        nama: nama,
        npm: npm,
        jurusan: jurusan,
        kegiatan: kegiatan,
        kelurahanID: kelurahanID,
        tanggal: date,
      });
      return res.status(200).json({ msg: "Logbook berhasil di tambahkan" });
    } catch (e) {
      return res.status(401).json({ msg: e.message });
    }
  }
};

const updateLogbook = async (req, res) => {
  const data = await Logbook.findOne({ where: { id: req.params.id } });
  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  const { nama, npm, jurusan, kegiatan, kelurahanID } = req.body;
  try {
    await Logbook.update(
      {
        nama: nama,
        npm: npm,
        jurusan: jurusan,
        kegiatan: kegiatan,
        kelurahanID: kelurahanID,
        tanggal: data.tanggal,
      },
      { where: { id: req.params.id } }
    );
    return res
      .status(200)
      .json({ status: "success", msg: "data berhasil di update" });
  } catch (e) {
    return res.status(401).json({ msg: e.message });
  }
};

const deleteLogbook = async (req, res) => {
  const data = await Logbook.findOne({ where: { id: req.params.id } });
  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  try {
    await Logbook.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({ msg: "data berhasil di hapus" });
  } catch (e) {
    return res.status(401).json({ msg: e.message });
  }
};

module.exports = {
  getLogbook,
  getLogbookByid,
  createLogbook,
  updateLogbook,
  deleteLogbook,
};
