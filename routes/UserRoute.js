const express = require("express");
const {
  getUsers,
  getUsersByid,
  createUsers,
  updateUsers,
  deleteUsers,
  getTotalUserCount
} = require("../controller/UserController");

const { VerifyUser } = require("../middleware/AuthUsers");

const router = express.Router();

router.get("/users", VerifyUser, getUsers);
router.get("/users/total", getTotalUserCount);
router.get("/users/:id", VerifyUser, getUsersByid);
router.post("/users", createUsers);
router.patch("/users/:id", VerifyUser, updateUsers);
router.delete("/users/:id", VerifyUser, deleteUsers);

module.exports = router;
