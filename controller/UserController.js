const Users = require("../models/UserModel");
const Argon2 = require("argon2");

const getUsers = (req, res) => {
  const dataUser = Users.findAll();
  return res.status(201).json({ status: "success", data: [dataUser] });
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

const updateUsers = (req, res) => {};

const deleteUsers = (req, res) => {};

module.exports = {
  getUsers,
  getUsersByid,
  createUsers,
  updateUsers,
  deleteUsers,
};
