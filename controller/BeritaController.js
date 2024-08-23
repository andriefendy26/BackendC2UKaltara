const BeritaModel = require("../models/BeritaModel");
const path = require("path");
const fs = require("fs");

const getBerita = async (req, res) => {
  const get = await BeritaModel.findAll();
  return res.status(200).json({ status: "success", daata: get });
};

const getBeritaByid = async (req, res) => {
  const data = await BeritaModel.findOne({ where: { id: req.params.id } });

  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  return res.status(200).json({ status: "success", data: data });
};

const createBerita = async (req, res) => {
  const judul = req.body.judul;
  const deskripsi = req.body.deskripsi;
  const jenis = req.body.jenis;
  const tanggal = req.body.tanggal;
  const kelurahanID = req.body.kelurahanID;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/berita/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "file harus di bawah 5MB" });
  file.mv(`./public/images/berita/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ msg: error });
    try {
      await BeritaModel.create({
        judul: judul,
        deskripsi: deskripsi,
        gambar: fileName,
        jenis: jenis,
        url: url,
        tanggal: tanggal,
        kelurahanID: kelurahanID,
      });
      return res.status(201).json({ msg: "Berita berhasil di upload" });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  });
};

const updateBerita = async (req, res) => {
  const data = await BeritaModel.findOne({ where: { id: req.params.id } });
  if (!data) return res.status(401).json({ msg: "data tidak ditemukan" });

  let fileName;
  if (req.files === null) {
    fileName = data.gambar;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;

    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "file harus di bawah 5MB" });

    const filePath = `./public/images/berita/${data.gambar}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/images/berita/${fileName}`, (error) => {
      if (error) return res.status(500).json({ msg: error });
    });
  }
  const judul = req.body.judul;
  const deskripsi = req.body.deskripsi;
  const jenis = req.body.jenis;
  const tanggal = req.body.tanggal;
  const kelurahanID = req.body.kelurahanID;
  const url = `${req.protocol}://${req.get("host")}/images/berita/${fileName}`;
  try {
    await BeritaModel.update(
      {
        judul: judul,
        deskripsi: deskripsi,
        jenis: jenis,
        tanggal: tanggal,
        kelurahanID: kelurahanID,
        url: url,
      },
      { where: { id: req.params.id } }
    );
    return res.status(201).json({ msg: "Berita berhasil di perbarharui" });
  } catch (e) {
    return res.status(401).json({ msg: e.message });
  }
};

const deleteBerita = async (req, res) => {
  const data = await BeritaModel.findOne({ where: { id: req.params.id } });
  if (!data) return res.status(401).json({ msg: "data tidak ditemukan" });
  try {
    const filePath = `./public/images/berita/${data.gambar}`;
    fs.unlinkSync(filePath);
    await BeritaModel.destroy({ where: { id: req.params.id } });
    return res.status(201).json({ msg: "berita berhasil dihapus" });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

module.exports = {
  getBerita,
  getBeritaByid,
  createBerita,
  updateBerita,
  deleteBerita,
};
