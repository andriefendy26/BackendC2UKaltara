const { Op } = require("sequelize");
const Datasampah = require("../models/DataSampahModel");
const moment = require("moment-timezone");
const Kelurahan = require("../models/KelurahanModel");

// const getData = async (req, res) => {
//   try {
//     const data = await Datasampah.findAll();
//     return res.status(200).json({ status: "success", data: data });
//   } catch (error) {
//     return res.status(500).json({ status: error.message });
//   }
// };

const getData = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 0;
  // const search = req.query.search_query || "";
  const tanggalStart = req.query.tanggal_start
    ? moment(req.query.tanggal_start).startOf("day").toDate()
    : null;
  const tanggalEnd = req.query.tanggal_end
    ? moment(req.query.tanggal_end).endOf("day").toDate()
    : null;
  const kelurahanId = parseInt(req.query.kelurahan_id) || null;

  //ngehitung offset
  const offset = limit * page;

  //menyimpan whereclause di dalam variable
  const whereClause = {};

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
  // Add kelurahan filtering if provided
  if (kelurahanId) {
    whereClause.kelurahanId = kelurahanId;
  }

  //menghitung total Row
  const totalRows = await Datasampah.count({
    where: whereClause,
  });

  //menghitung total pages
  const totalPages = Math.ceil(totalRows / limit);
  // console.log(whereClause);

  const result = await Datasampah.findAll({
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

const getDataByid = async (req, res) => {
  try {
    const data = await Datasampah.findOne({ where: { id: req.params.id } });
    if (!data) return res.status(404).json({ msg: "data tidak di temukan" });
    return res.status(200).json({ status: "success", data: data });
  } catch (error) {
    return res.status(500).json({ status: error.message });
  }
};

const createData = async (req, res) => {
  // let kelurahan;
  // if (!req.body.kelurahanID) {
  //   kelurahan = req.kelurahan;
  // }
  // kelurahan = req.body.kelurahanID;
  const {
    lokasi,
    sampahWisata,
    sampahWarga,
    sampahRumputLaut,
    sampahIndustri,
    partisipan,
  } = req.body;

  let tanggal = req.body.tanggal
    ? req.body.tanggal
    : moment().tz("Asia/Makassar").format("YYYY-MM-DD");

  // Konversi nilai sampah ke angka dengan default 0 jika null atau undefined
  const wisata = parseFloat(sampahWisata) || 0;
  const warga = parseFloat(sampahWarga) || 0;
  const rumputLaut = parseFloat(sampahRumputLaut) || 0;
  const industri = parseFloat(sampahIndustri) || 0;

  // Hitung total sampah
  const totalSampah = wisata + warga + rumputLaut + industri;

  // Periksa apakah semua kolom yang diperlukan telah diisi
  if (
    !lokasi ||
    isNaN(wisata) ||
    isNaN(warga) ||
    isNaN(rumputLaut) ||
    isNaN(industri)
  ) {
    return res
      .status(401)
      .json({ msg: "Semua kolom harus diisi dengan benar" });
  }
  try {
    const insertData = await Datasampah.create({
      lokasi: lokasi,
      tanggal: tanggal,
      sampahwisata: sampahWisata,
      sampahwarga: sampahWarga,
      sampahrumputlaut: sampahRumputLaut,
      sampahindustri: sampahIndustri,
      partisipan: partisipan,
      totalsampah: totalSampah,
      kelurahanID:
        (req.body.kelurahanID == null) | ""
          ? req.kelurahan
          : req.body.kelurahanID,
    });
    if (!insertData) res.status(500).json({ msg: "gagal menginputkan data" });
    return res
      .status(200)
      .json({ msg: "sukses menambahkan data", data: insertData });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateData = async (req, res) => {
  try {
    // Ambil data berdasarkan ID dari parameter
    const data = await Datasampah.findOne({ where: { id: req.params.id } });
    if (!data) return res.status(400).json({ msg: "Data tidak ditemukan" });

    // Ambil nilai dari body request
    const {
      lokasi,
      sampahWisata,
      sampahWarga,
      sampahRumputLaut,
      sampahIndustri,
      partisipan,
    } = req.body;

    // Gunakan tanggal dari body request atau tanggal saat ini
    const tanggal = req.body.tanggal
      ? req.body.tanggal
      : moment().tz("Asia/Makassar").format("YYYY-MM-DD");

    // Konversi nilai sampah ke angka dengan default 0 jika null atau undefined
    const wisata = parseFloat(sampahWisata) || 0;
    const warga = parseFloat(sampahWarga) || 0;
    const rumputLaut = parseFloat(sampahRumputLaut) || 0;
    const industri = parseFloat(sampahIndustri) || 0;

    // Hitung total sampah
    const totalSampah = wisata + warga + rumputLaut + industri;

    // Periksa apakah semua kolom yang diperlukan telah diisi
    if (
      !lokasi ||
      isNaN(wisata) ||
      isNaN(warga) ||
      isNaN(rumputLaut) ||
      isNaN(industri)
    ) {
      return res
        .status(401)
        .json({ msg: "Semua kolom harus diisi dengan benar" });
    }

    // Update data
    const updatedData = await Datasampah.update(
      {
        lokasi: lokasi,
        tanggal: tanggal,
        sampahwisata: wisata,
        sampahwarga: warga,
        sampahrumputlaut: rumputLaut,
        sampahindustri: industri,
        partisipan: partisipan,
        totalsampah: totalSampah,
        kelurahanID: req.body.kelurahanID || req.kelurahan,
      },
      { where: { id: req.params.id } }
    );

    if (updatedData[0] === 0) {
      return res.status(500).json({ msg: "Gagal memperbarui data" });
    }

    return res.status(200).json({ msg: "Sukses memperbarui data" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// const updateData = async (req, res) => {
//   const data = await Datasampah.findOne({ where: { id: req.params.id } });
//   if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
//   // kelurahan = req.kelurahan;
//   // if (!req.kelurahan) {
//   //   kelurahan = req.body.kelurahanID;
//   // }
//   const {
//     lokasi,
//     sampahWisata,
//     sampahWarga,
//     sampahRumputLaut,
//     sampahIndustri,
//     partisipan,
//   } = req.body;

//   // let tanggal = moment().tz("Asia/Makassar").format("YYYY-MM-DD");

//   let tanggal = req.body.tanggal
//     ? req.body.tanggal
//     : moment().tz("Asia/Makassar").format("YYYY-MM-DD");

//   let totalSampah = sampahWisata + sampahWarga + sampahRumputLaut + sampahIndustri;

//   if (
//     lokasi == "" ||
//     sampahWisata == null ||
//     sampahWarga == null ||
//     sampahRumputLaut == null ||
//     sampahIndustri == null
//   )
//     return res.status(401).json({ msg: "Semua kolom harus di isi" });
//   try {
//     const updateData = await Datasampah.update(
//       {
//         lokasi: lokasi,
//         tanggal: tanggal,
//         sampahwisata: sampahWisata,
//         sampahwarga: sampahWarga,
//         sampahrumputlaut: sampahRumputLaut,
//         sampahindustri: sampahIndustri,
//         partisipan: partisipan,
//         totalsampah: totalSampah,
//         kelurahanID:
//           (req.body.kelurahanID == null) | ""
//             ? req.kelurahan
//             : req.body.kelurahanID,
//       },
//       { where: { id: req.params.id } }
//     );
//     if (!updateData) res.status(500).json({ msg: "gagal memperbaruhi data" });
//     return res.status(200).json({ msg: "sukses memperbaruhi data" });
//   } catch (error) {
//     return res.status(500).json({ msg: error.message });
//   }
// };

const deleteData = async (req, res) => {
  const data = await Datasampah.findOne({ where: { id: req.params.id } });
  if (!data) return res.status(400).json({ msg: "data tidak ditemukan" });
  try {
    await Datasampah.destroy({
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
  getData,
  getDataByid,
  createData,
  updateData,
  deleteData,
};
