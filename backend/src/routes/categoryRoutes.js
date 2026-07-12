const express = require("express");
const {
  getCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../validators/categoryValidator");

const router = express.Router();

router.get("/", getCategoriesHandler);
router.post("/", authenticate, authorizeRoles("ADMIN"), createCategoryValidator, validate, createCategoryHandler);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateCategoryValidator, validate, updateCategoryHandler);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteCategoryHandler);

module.exports = router;