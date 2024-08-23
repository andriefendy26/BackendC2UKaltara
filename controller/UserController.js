const Users = require("../models/UserModel");
const Argon2 = require("argon2");

const getUsers = async (req, res) => {
  const dataUser = await Users.findAll();
  return res.status(201).json({ status: "success", data: dataUser });
};

const getUsersByid = async (req, res) => {
  //menyimpan parameter req id
  const idReq = req.params.id;
  //mengambil data berdasarkan id
  const dataUserById = await Users.findOne({ where: { id: idReq } });
  //pengkondisian jika data yang dicari di temukan
  if (dataUserById) {
    return res.status(200).json({ status: "success", data: dataUserById });
  } else {
    return res.status(401).json({
      status: "failed",
      message: "user yang di cari tidak di temukan",
    });
  }
};

const createUsers = async (req, res) => {
  try {
    const { nama, email, password, roleID, kelurahanID } = req.body;
    const matchUser = await Users.findOne({ where: { email: email } });
    if (matchUser) {
      return res
        .status(200)
        .json({ msg: "Email yang dimasukkan sudah terdaftar" });
    }

    const hasingPass = await Argon2.hash(password);

    if (hasingPass) {
      const user = await Users.create({
        nama,
        email,
        password: hasingPass,
        roleID,
        kelurahanID,
      });

      if (user) {
        return res
          .status(200)
          .json({ status: "success", message: "Akun Berhasil Di Register" });
      } else {
        return res
          .status(400)
          .json({ status: "failed", message: "Akun Gagal Di Register" });
      }
    }
  } catch (e) {
    return res.status(400).json({ status: "failed", message: e.message });
  }
};

const updateUsers = async (req, res) => {
  //cari user yang akan di update
  const { email, nama, password, roleID, kelurahanID } = req.body;
  const findUser = await Users.findOne({ where: { id: req.params.id } });
  //return  jika tidak ditemukan
  if (!findUser) return res.status(400).json({ msg: "User tidak di temukan" });
  if (
    nama == "" ||
    email == "" ||
    password == "" ||
    roleID == "" ||
    kelurahanID == ""
  ) {
    return res.status(400).json({ msg: "Semua from wajib di isi" });
  } else {
    try {
      hasingPass = await Argon2.hash(password);

      const updateUser = await Users.update(
        {
          nama: nama,
          email: email,
          password: hasingPass,
          roleID: roleID,
          kelurahanID: kelurahanID,
        },
        { where: { id: req.params.id } }
      );
      if (!updateUser)
        return res.status(400).json({ msg: "Gagal mengupdate user" });
      return res.status(200).json({ msg: "Berhasil mengupdate user" });
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  }
};

const deleteUsers = async (req, res) => {
  //cari user yang akan di update
  const { email, nama, password, roleID, kelurahanID } = req.body;
  const findUser = await Users.findOne({ where: { id: req.params.id } });
  //return  jika tidak ditemukan
  if (!findUser) return res.status(400).json({ msg: "User tidak di temukan" });
  try {
    const deleteUser = await Users.destroy({ where: { id: req.params.id } });
    if (!deleteUser)
      return res.status(400).json({ msg: "Gagal menghapus user" });
    return res.status(200).json({ msg: "Berhasil menghapus user" });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

module.exports = {
  getUsers,
  getUsersByid,
  createUsers,
  updateUsers,
  deleteUsers,
};
