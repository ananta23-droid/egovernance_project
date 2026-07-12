const { body, param } = require("express-validator");

const createDepartmentValidator = [
  body("name").trim().notEmpty().withMessage("Department name is required."),
  body("description").optional().trim(),
];

const updateDepartmentValidator = [
  param("id").isInt({ gt: 0 }).withMessage("Valid department ID is required."),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("description").optional().trim(),
];

module.exports = { createDepartmentValidator, updateDepartmentValidator };