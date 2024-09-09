const express = require("express");
const {
  getBerita,
  getBeritaByid,
  createBerita,
  updateBerita,
  deleteBerita,
  getTotalBeritaCount,
  getBertiaByJenis,
  getUpdateberita
} = require("../controller/BeritaController");
const { VerifyUser } = require("../middleware/AuthUsers");

const router = express.Router();

router.get("/berita", getBerita);
router.get("/berita/update", getUpdateberita);
router.get("/berita/jenis", getBertiaByJenis);
router.get("/berita/total", getTotalBeritaCount);
router.get("/berita/:id", getBeritaByid);
router.post("/berita", VerifyUser, createBerita);
router.patch("/berita/:id", VerifyUser, updateBerita);
router.delete("/berita/:id", VerifyUser, deleteBerita);

module.exports = router;
