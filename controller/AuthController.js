const Kelurahan = require("../models/KelurahanModel");
const Roles = require("../models/RolesModel");
const Users = require("../models/UserModel");
const Argon2 = require("argon2");

const Login = async (req, res) => {
  const user = await Users.findOne({ where: { email: req.body.email } });
  if (user) {
    const matchPassword = await Argon2.verify(user.password, req.body.password);
    if (matchPassword) {
      req.session.userId = user.id;
      const nama = user.nama;
      const email = user.email;
      const roleID = user.roleID;
      const kelurahanID = user.kelurahanID;
      return res
        .status(200)
        .json({ nama, email, roleID, kelurahanID, msg: "Anda berhasil login" });
    } else {
      return res.status(400).json({ msg: "Password salah" });
    }
  } else { 
    return res.status(404).json({ msg: "user tidak ditemukan" });
  }
};

const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ msg: "Anda tidak dapat logout" });
    }
    return res.status(200).json({ msg: "Anda berhasil logout" });
  });
};

const OnLogin = async (req, res) => {
  if (!req.session.userId) {
    return res.status(405).json({ msg: "mohon login terlebih dahulu" });
  }
  const user = await Users.findOne({
    attributes: ["nama", "email", "roleID", "kelurahanID"],
    where: { id: req.session.userId },
    include : [Kelurahan, Roles]
  });
  if (!user) return res.status(400).json({ msg: "user tidak di temukan" });
  return res.status(200).json(user);
};

module.exports = {
  Login,
  Logout,
  OnLogin,
};
