const express = require("express");
const {
  getBerita,
  getBeritaByid,
  createBerita,
  updateBerita,
  deleteBerita,
} = require("../controller/BeritaController");

const router = express.Router();

router.get("/berita", getBerita);
router.get("/berita/:id", getBeritaByid);
router.post("/berita", createBerita);
router.patch("/berita/:id", updateBerita);
router.delete("/berita/:id", deleteBerita);

module.exports = router;
