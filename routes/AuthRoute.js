const express = require("express");
const { Login, Logout, OnLogin } = require("../controller/AuthController");

const router = express.Router();

router.post("/Login", Login);
router.get("/onlogin", OnLogin);
router.delete("/Logout", Logout);

module.exports = router;
