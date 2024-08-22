const express = require("express");
const {
  getData,
  getDataByid,
  createData,
  updateData,
  deleteData,
} = require("../controller/DataController");

const router = express.Router();

router.get("/data", getData);
router.get("/data/:id", getDataByid);
router.post("/data", createData);
router.patch("/data/:id", updateData);
router.delete("/data/:id", deleteData);

module.exports = router;
