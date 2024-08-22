const express = require("express");
const {
  getRoles,
  getRolesByid,
  createRoles,
  updateRoles,
  deleteRoles,
} = require("../controller/RoleController");

const router = express.Router();

router.get("/roles", getRoles);
router.get("/roles/:id", getRolesByid);
router.post("/roles", createRoles);
router.patch("/roles/:id", updateRoles);
router.delete("/roles/:id", deleteRoles);

module.exports = router;
