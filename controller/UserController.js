const { Op } = require("sequelize");
const Kelurahan = require("../models/KelurahanModel");
const Roles = require("../models/RolesModel");
const Users = require("../models/UserModel");
const Argon2 = require("argon2");

// const getUsers = async (req, res) => {
//   const dataUser = await Users.findAll({
//     include: [{ model: Kelurahan }, { model: Roles }],
//   });
//   return res.status(201).json({ status: "success", data: dataUser });
// };

const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 0;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await Users.count({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
        { email: { [Op.like]: "%" + search + "%" } },
      ],
    },
  });

  const totalPages = Math.ceil(totalRows / limit);
  const result = await Users.findAll({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
        { email: { [Op.like]: "%" + search + "%" } },
      ],
    },
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
    include: [{ model: Kelurahan }, { model: Roles }],
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
    if (!nama || !email || !password || !roleID || !kelurahanID) {
      return res.status(400).json({
        status: "failed",
        message: "Semua field harus diisi",
      });
    }
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

// const updateUsers = async (req, res) => {
//   //cari user yang akan di update
//   const { email, nama, password, roleID, kelurahanID } = req.body;

//   const findUser = await Users.findOne({ where: { id: req.params.id } });
//   //return  jika tidak ditemukan
//   if (!findUser) return res.status(400).json({ msg: "User tidak di temukan" });
//   if (
//     nama == "" ||
//     email == "" ||
//     password == "" ||
//     roleID == "" ||
//     kelurahanID == ""
//   ) {
//     return res.status(400).json({ msg: "Semua from wajib di isi" });
//   } else {
//     try {
//       hasingPass = await Argon2.hash(password);

//       const updateUser = await Users.update(
//         {
//           nama: nama,
//           email: email,
//           password: hasingPass,
//           roleID: roleID,
//           kelurahanID: kelurahanID,
//         },
//         { where: { id: req.params.id } }
//       );
//       if (!updateUser)
//         return res.status(400).json({ msg: "Gagal mengupdate user" });
//       return res.status(200).json({ msg: "Berhasil mengupdate user" });
//     } catch (e) {
//       return res.status(400).json({ msg: e.message });
//     }
//   }
// };

const updateUsers = async (req, res) => {
  const { email, nama, password, roleID, kelurahanID } = req.body;

  try {
    // Cari user yang akan diupdate
    const findUser = await Users.findOne({ where: { id: req.params.id } });

    // Return jika tidak ditemukan
    if (!findUser) return res.status(400).json({ msg: "User tidak ditemukan" });

    // Validasi form input
    if (nama === "" || email === "" || roleID === "" || kelurahanID === "") {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    // Update data user
    const updatedData = {
      nama: nama,
      email: email,
      roleID: roleID,
      kelurahanID: kelurahanID,
    };

    // Jika password tidak kosong, hash password baru
    if (password) {
      updatedData.password = await Argon2.hash(password);
    }

    const updateUser = await Users.update(updatedData, {
      where: { id: req.params.id },
    });

    if (updateUser[0] === 0) {
      return res.status(400).json({ msg: "Gagal mengupdate user" });
    }

    return res.status(200).json({ msg: "Berhasil mengupdate user" });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
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
