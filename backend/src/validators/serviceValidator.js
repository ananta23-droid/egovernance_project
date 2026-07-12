const { body, param } = require("express-validator");

const createServiceValidator = [
  body("departmentId").isInt({ gt: 0 }).withMessage("Valid departmentId is required."),
  body("categoryId").isInt({ gt: 0 }).withMessage("Valid categoryId is required."),
  body("title").trim().notEmpty().withMessage("Service title is required."),
  body("description").trim().notEmpty().withMessage("Service description is required."),
  body("eligibility").optional().trim(),
  body("requiredDocuments").optional().trim(),
  body("processSteps").optional().trim(),
  body("feeInfo").optional().trim(),
  body("officeInfo").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean."),
];

const updateServiceValidator = [
  param("id").isInt({ gt: 0 }).withMessage("Valid service ID is required."),
  body("departmentId").optional().isInt({ gt: 0 }),
  body("categoryId").optional().isInt({ gt: 0 }),
  body("title").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("eligibility").optional().trim(),
  body("requiredDocuments").optional().trim(),
  body("processSteps").optional().trim(),
  body("feeInfo").optional().trim(),
  body("officeInfo").optional().trim(),
  body("isActive").optional().isBoolean(),
];

module.exports = { createServiceValidator, updateServiceValidator };