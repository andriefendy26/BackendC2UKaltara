const express = require("express");
const {
  getLogbook,
  getLogbookByid,
  createLogbook,
  updateLogbook,
  deleteLogbook,
} = require("../controller/LogbookController");

const router = express.Router();

router.get("/Logbook", getLogbook);
router.get("/Logbook/:id", getLogbookByid);
router.post("/Logbook", createLogbook);
router.patch("/Logbook/:id", updateLogbook);
router.delete("/Logbook/:id", deleteLogbook);

module.exports = router;
