const express = require("express");
const {
  getData,
  getDataByid,
  createData,
  updateData,
  deleteData,
} = require("../controller/DataController");

const router = express.Router();

const { VerifyUser } = require("../middleware/AuthUsers");

router.get("/data", getData);
router.get("/data/:id", getDataByid);
router.post("/data", VerifyUser, createData);
router.patch("/data/:id", VerifyUser, updateData);
router.delete("/data/:id", VerifyUser, deleteData);

module.exports = router;
