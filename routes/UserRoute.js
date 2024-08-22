const express = require("express");
const {
  getUsers,
  getUsersByid,
  createUsers,
  updateUsers,
  deleteUsers,
} = require("../controller/UserController");

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUsersByid);
router.post("/users", createUsers);
router.patch("/users/:id", updateUsers);
router.delete("/users/:id", deleteUsers);

module.exports = router;
