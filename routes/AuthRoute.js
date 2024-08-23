const express = require("express");
const { Login, Logout, OnLogin } = require("../controller/AuthController");

const router = express.Router();

router.post("/Login", Login);
router.delete("/Logout", Logout);
router.get("/onlogin", OnLogin);

module.exports = router;
