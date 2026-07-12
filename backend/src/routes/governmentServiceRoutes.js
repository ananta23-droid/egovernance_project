const express = require("express");
const {
  getServicesHandler,
  getServiceByIdHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
} = require("../controllers/governmentServiceController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { createServiceValidator, updateServiceValidator } = require("../validators/serviceValidator");

const router = express.Router();

router.get("/", getServicesHandler);
router.get("/:id", getServiceByIdHandler);

router.post("/", authenticate, authorizeRoles("ADMIN"), createServiceValidator, validate, createServiceHandler);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateServiceValidator, validate, updateServiceHandler);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteServiceHandler);

module.exports = router;