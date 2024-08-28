const Roles = require("../models/RolesModel");

const getRoles = async (req, res) => {
  const dataUser = await Roles.findAll();
  return res.status(201).json({ status: "success", data: dataUser });
};

const getRolesByid = async (req, res) => {
  const dataUserByID = await Roles.findOne({ where: { id: req.params.id } });
  if (!dataUserByID)
    return res.status(401).json({ msg: "Data tidak ditemukan" });
  return res.status(201).json({ status: "success", data: dataUserByID });
};

const createRoles = async (req, res) => {
  const insertData = await Roles.create({ roleName: req.body.roleName });
  if (!insertData)
    return res.status(400).json({ msg: "Gagal menginputkan data" });
  return res.status(200).json({ msg: "Berhasil menginputkan data" });
};

const updateRoles = async (req, res) => {
  //cari data role yang akan di hapus
  const findRole = await Roles.findOne({ where: { id: req.params.id } });
  //return jika data tidak di temukan
  if (!findRole) return res.status(400).json({ msg: "Role tidak di temukan" });
  //delete role
  const updateRole = await Roles.update(
    { roleName: req.body.roleName },
    { where: { id: req.params.id } }
  );
  //jika role gagal di delete maka akan return
  if (!updateRole) return res.status(400).json({ msg: "Gagal mengupdate role" });
  //jika berhasil menghapus role
  return res
    .status(200)
    .json({ status: "success", msg: "Berhasil mengupdate role" });
};

const deleteRoles = async (req, res) => {
  //cari data role yang akan di hapus
  const findRole = await Roles.findOne({ where: { id: req.params.id } });
  //return jika data tidak di temukan
  if (!findRole) return res.status(400).json({ msg: "Role tidak di temukan" });
  //delete role
  const deleteRole = await Roles.destroy({ where: { id: req.params.id } });
  //jika role gagal di delete maka akan return
  if (!deleteRole) return res.status(400).json({ msg: "Gagal menghapus role" });
  //jika berhasil menghapus role
  return res
    .status(200)
    .json({ status: "success", msg: "Berhasil menghapus role" });
};

module.exports = {
  getRoles,
  getRolesByid,
  createRoles,
  updateRoles,
  deleteRoles,
};
