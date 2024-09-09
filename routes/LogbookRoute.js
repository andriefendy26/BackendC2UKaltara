const express = require("express");
const {
  getLogbook,
  getLogbookByid,
  createLogbook,
  updateLogbook,
  deleteLogbook,
  getLogbookByKelid,
  getTotalLogbookCount
} = require("../controller/LogbookController");

const router = express.Router();

router.get("/Logbook", getLogbook);
router.get("/Logbook/total", getTotalLogbookCount);
router.get("/Logbook/:id", getLogbookByid);
router.get("/Logbook/kelurahan/:id", getLogbookByKelid);
router.post("/Logbook", createLogbook);
router.patch("/Logbook/:id", updateLogbook);
router.delete("/Logbook/:id", deleteLogbook);

module.exports = router;
