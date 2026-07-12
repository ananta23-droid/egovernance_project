const { body, param } = require("express-validator");

const createCategoryValidator = [
  body("departmentId").isInt({ gt: 0 }).withMessage("Valid departmentId is required."),
  body("name").trim().notEmpty().withMessage("Category name is required."),
  body("description").optional().trim(),
];

const updateCategoryValidator = [
  param("id").isInt({ gt: 0 }).withMessage("Valid category ID is required."),
  body("departmentId").optional().isInt({ gt: 0 }).withMessage("departmentId must be valid."),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("description").optional().trim(),
];

module.exports = { createCategoryValidator, updateCategoryValidator };