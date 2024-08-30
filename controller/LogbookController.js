const { Op } = require("sequelize");
const Logbook = require("../models/LogbookModel");
const moment = require("moment-timezone");
const path = require("path");
const fs = require("fs");
const Kelurahan = require("../models/KelurahanModel");

const getLogbook = async (req, res) => {
  const data = await Logbook.findAll();
  return res.status(200).json({ status: "success", data: data });
};

const getLogbookByid = async (req, res) => {
  const data = await Logbook.findOne({ where: { id: req.params.id } });

  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  return res.status(200).json({ status: "success", data: data });
};

// const getLogbookByKelid = async (req, res) => {
//   const data = await Logbook.findAll({ where: { kelurahanID: req.params.id } });

//   if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
//   return res.status(200).json({ status: "success", data: data });
// };

const getLogbookByKelid = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search_query || "";
  const tanggalStart = req.query.tanggal_start
    ? moment(req.query.tanggal_start).startOf("day").toDate()
    : null;
  const tanggalEnd = req.query.tanggal_end
    ? moment(req.query.tanggal_end).endOf("day").toDate()
    : null;

  //ngehitung offset
  const offset = limit * page;
  const whereClause = {
    kelurahanID: req.params.id,
    nama: {
      [Op.like]: "%" + search + "%",
    },
  };

  // Add date filtering if provided
  if (tanggalStart && tanggalEnd) {
    whereClause.tanggal = {
      [Op.between]: [tanggalStart, tanggalEnd],
    };
  } else if (tanggalStart) {
    whereClause.tanggal = {
      [Op.gte]: tanggalStart,
    };
  } else if (tanggalEnd) {
    whereClause.tanggal = {
      [Op.lte]: tanggalEnd,
    };
  }
  //menghitung total Row
  const totalRows = await Logbook.count({
    where: whereClause,
  });

  //menghitung total pages
  const totalPages = Math.ceil(totalRows / limit);

  const data = await Logbook.findAll({
    where: whereClause,
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });

  return res.status(201).json({
    status: "success",
    data: data,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPages: totalPages,
  });

  // if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  // return res.status(200).json({ status: "success", data: data });
};

// const createLogbook = async (req, res) => {
//   const { nama, npm, jurusan, kegiatan, kelurahanID } = req.body;
//   const date = moment().tz("Asia/Makassar").format("YYYY-MM-DD");

// if (
//   nama == "" ||
//   npm == "" ||
//   jurusan == "" ||
//   kegiatan == "" ||
//   kelurahanID == ""
// ) {
//   return res.status(401).json({ msg: "pastikan semua kolom terisi" });
//   } else {
//     try {
//       await Logbook.create({
//         nama: nama,
//         npm: npm,
//         jurusan: jurusan,
//         kegiatan: kegiatan,
//         kelurahanID: kelurahanID,
//         tanggal: date,
//       });
//       return res.status(200).json({ msg: "Logbook berhasil di tambahkan" });
//     } catch (e) {
//       return res.status(401).json({ msg: e.message });
//     }
//   }
// };

const createLogbook = async (req, res) => {
  const { nama, npm, jurusan, kegiatan, kelurahanID } = req.body;
  if (
    nama == "" ||
    npm == "" ||
    jurusan == "" ||
    kegiatan == "" ||
    kelurahanID == "" ||
    !req.files ||
    !req.files.file
  ) {
    return res.status(401).json({ msg: "pastikan semua kolom terisi" });
  }
  const findkelurahan = await Kelurahan.findOne({ where: { id: kelurahanID } });
  let namaKel = findkelurahan.namaKelurahan.replace(/\s+/g, "");

  const date = moment().tz("Asia/Makassar").format("YYYY-MM-DD");

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get(
    "host"
  )}/images/logbook/${namaKel}/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "file harus di bawah 5MB" });
  file.mv(`./public/images/logbook/${namaKel}/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ msg: error });
    try {
      await Logbook.create({
        nama: nama,
        npm: npm,
        jurusan: jurusan,
        gambar: fileName,
        url: url,
        kegiatan: kegiatan,
        kelurahanID: kelurahanID,
        tanggal: date,
      });
      return res.status(200).json({ msg: "Logbook berhasil di tambahkan" });
    } catch (e) {
      return res.status(401).json({ msg: e.message });
    }
  });
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
  const findkelurahan = await Kelurahan.findOne({
    where: { id: data.kelurahanID },
  });
  let namaKel = findkelurahan.namaKelurahan.replace(/\s+/g, "");
  try {
    const filePath = `./public/images/logbook/${namaKel}/${data.gambar}`;
    fs.unlinkSync(filePath);
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

// const deleteLogbook = async (req, res) => {
//   const data = await Logbook.findOne({ where: { id: req.params.id } });
//   if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
//   try {
//     await Logbook.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });
//     return res.status(200).json({ msg: "data berhasil di hapus" });
//   } catch (e) {
//     return res.status(401).json({ msg: e.message });
//   }
// };

module.exports = {
  getLogbook,
  getLogbookByid,
  getLogbookByKelid,
  createLogbook,
  updateLogbook,
  deleteLogbook,
};
