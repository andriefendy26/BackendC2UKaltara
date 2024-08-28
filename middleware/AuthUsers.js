const Users = require("../models/UserModel");

const VerifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "mohon login ke akun anda" });
  }
  const user = await Users.findOne({ where: { id: req.session.userId } });
  if (!user) return res.status(404).json({ msg: "User tidak di temukan" });
  req.userId = user.id;
  req.role = user.roleID;
  req.kelurahan = user.kelurahanID;
  next();
};

module.exports = {
  VerifyUser,
};
