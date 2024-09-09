const BeritaModel = require("../models/BeritaModel");
const path = require("path");
const fs = require("fs");
const Kelurahan = require("../models/KelurahanModel");

// const getBerita = async (req, res) => {
//   const get = await BeritaModel.findAll();
//   return res.status(200).json({ status: "success", daata: get });
// };

const getUpdateberita = async (req, res) => {
  try {
    const data = await BeritaModel.findAll({
      limit: 5,
      order: [["tanggal", "DESC"]],
      include: Kelurahan,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getBertiaByJenis = async (req, res) => {
  const { jenis } = req.query;
  try {
    const data = await BeritaModel.findAll({
      where: { jenis: jenis },
      include: Kelurahan,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getBerita = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 0;
  const kelurahanId = parseInt(req.query.kelurahan_id) || null;

  //ngehitung offset
  const offset = limit * page;

  //menyimpan whereclause di dalam variable
  const whereClause = {};

  // Add kelurahan filtering if provided
  if (kelurahanId) {
    whereClause.kelurahanID = kelurahanId;
  }

  //menghitung total Row
  const totalRows = await BeritaModel.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalRows / limit);

  const result = await BeritaModel.findAll({
    where: whereClause,
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
    include: { model: Kelurahan },
  });

  return res.status(201).json({
    status: "success",
    data: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPages: totalPages,
  });
};

const getTotalBeritaCount = async (req, res) => {
  try {
    // Count total logbook records
    const totalCount = await BeritaModel.count();

    // Respond with the total count
    return res.status(200).json({
      status: "success",
      totalBeritaCount: totalCount,
    });
  } catch (e) {
    // Handle any errors that occur
    console.error(e.message);
    return res
      .status(500)
      .json({ msg: "Terjadi kesalahan saat mengambil data total logbook" });
  }
};

const getBeritaByid = async (req, res) => {
  const data = await BeritaModel.findOne({
    where: { id: req.params.id },
    include: Kelurahan,
  });

  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  return res.status(200).json({ status: "success", data: data });
};

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createBerita = async (req, res) => {
  if (
    req.body.judul == "" ||
    req.body.deskripsi == "" ||
    req.body.jenis == "" ||
    req.body.tanggal == "" ||
    // req.body.kelurahanID == "" ||
    !req.files ||
    !req.files.file
  ) {
    return res.status(401).json({ msg: "pastikan semua kolom terisi" });
  }

  const now = new Date();
  const judul = req.body.judul;
  const deskripsi = req.body.deskripsi;
  const jenis = req.body.jenis;
  const tanggal = req.body.tanggal;
  // const kelurahanID = req.body.kelurahanID == null ?  req.body.kelurahanID : req.kelurahanID ;

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = tanggal + generateRandomString(10) + now.getSeconds() + ext;
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
        kelurahanID:
          (req.body.kelurahanID == null) | ""
            ? req.kelurahan
            : req.body.kelurahanID,
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
  const now = new Date();

  let fileName;
  if (req.files === null) {
    fileName = data.gambar;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = tanggal + generateRandomString(10) + now.getSeconds() + ext;

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
        kelurahanID: req.body.kelurahanID || req.kelurahan,
        url: url,
      },
      { where: { id: req.params.id } }
    );
    return res.status(201).json({ msg: "Berita berhasil di perbarharui" });
  } catch (e) {
    return res.status(41).json({ msg: e.message });
  }
};

const deleteBerita = async (req, res) => {
  const beritaId = req.params.id;

  try {
    // Find the berita record
    const data = await BeritaModel.findOne({ where: { id: beritaId } });
    if (!data) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    // Construct the file path
    const filePath = path.join(
      __dirname,
      "../public/images/berita",
      data.gambar
    );

    // const filePath = `./public/images/berita/${data.gambar}`;

    // Attempt to delete the file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the berita record from the database
    await BeritaModel.destroy({ where: { id: beritaId } });

    // Respond with success
    return res.status(200).json({ msg: "Berita berhasil dihapus" });
  } catch (e) {
    // Handle any errors that occur
    console.error(e.message);
    return res
      .status(500)
      .json({ msg: "Terjadi kesalahan saat menghapus berita" });
  }
};

module.exports = {
  getBerita,
  getBeritaByid,
  createBerita,
  updateBerita,
  deleteBerita,
  getTotalBeritaCount,
  getBertiaByJenis,
  getUpdateberita,
};
