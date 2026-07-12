const express = require("express");
const {
  getDepartments,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} = require("../controllers/departmentController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createDepartmentValidator,
  updateDepartmentValidator,
} = require("../validators/departmentValidator");

const router = express.Router();

router.get("/", getDepartments);
router.post("/", authenticate, authorizeRoles("ADMIN"), createDepartmentValidator, validate, createDepartmentHandler);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateDepartmentValidator, validate, updateDepartmentHandler);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteDepartmentHandler);

module.exports = router;