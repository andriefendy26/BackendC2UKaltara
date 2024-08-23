const KelurahanModel = require("../models/KelurahanModel");

const getKelurahan = async (req, res) => {
  const getKelurahan = await KelurahanModel.findAll();
  return res.status(200).json({ status: "success", data: getKelurahan });
};

const getKelurahanByid = async (req, res) => {
  const getKelurahan = await KelurahanModel.findOne({
    where: { id: req.params.id },
  });
  if (!getKelurahan)
    return res.status(400).json({ msg: "kelurahan tidak di temukan" });
  return res.status(200).json({ status: "success", data: getKelurahan });
};

const createKelurahan = async (req, res) => {
  const insertData = await KelurahanModel.create({
    namaKelurahan: req.body.namaKelurahan,
  });
  if (!insertData)
    return res.status(400).json({ msg: "Gagal menginputkan data" });
  return res.status(200).json({ msg: "Berhasil menginputkan data" });
};

const updateKelurahan = async (req, res) => {
  //cari data kelurahan yang akan di hapus
  const findKelurahan = await KelurahanModel.findOne({
    where: { id: req.params.id },
  });
  //return jika data tidak di temukan
  if (!findKelurahan)
    return res.status(400).json({ msg: "Kelurahan tidak di temukan" });
  //delete kelurahan
  const updateKelurahan = await KelurahanModel.update(
    { namaKelurahan: req.body.namaKelurahan },
    { where: { id: req.params.id } }
  );
  //jika kelurahan gagal di delete maka akan return
  if (!updateKelurahan)
    return res.status(400).json({ msg: "Gagal mengupdate kelurahan" });
  //jika berhasil menghapus kelurahan
  return res
    .status(200)
    .json({ status: "success", msg: "Berhasil mengupdate kelurahan" });
};

const deleteKelurahan = async (req, res) => {
  //cari data Kelurahan yang akan di hapus
  const findKelurahan = await KelurahanModel.findOne({
    where: { id: req.params.id },
  });
  //return jika data tidak di temukan
  if (!findKelurahan)
    return res.status(400).json({ msg: "Kelurahan tidak di temukan" });
  //delete Kelurahan
  const deleteKelurahan = await KelurahanModel.destroy({
    where: { id: req.params.id },
  });
  //jika Kelurahan gagal di delete maka akan return
  if (!deleteKelurahan)
    return res.status(400).json({ msg: "Gagal menghapus Kelurahan" });
  //jika berhasil menghapus Kelurahan
  return res
    .status(200)
    .json({ status: "success", msg: "Berhasil menghapus Kelurahan" });
};

module.exports = {
  getKelurahan,
  getKelurahanByid,
  createKelurahan,
  updateKelurahan,
  deleteKelurahan,
};
