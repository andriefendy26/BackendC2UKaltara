const express = require("express");
const {
  getKelurahan,
  getKelurahanByid,
  createKelurahan,
  updateKelurahan,
  deleteKelurahan,
} = require("../controller/KelurahanController");

const router = express.Router();


router.get("/kelurahan", getKelurahan);
router.get("/kelurahan/:id", getKelurahanByid);
router.post("/kelurahan", createKelurahan);
router.patch("/kelurahan/:id", updateKelurahan);
router.delete("/kelurahan/:id", deleteKelurahan);

module.exports = router;
