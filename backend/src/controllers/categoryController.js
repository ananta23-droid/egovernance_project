const { successResponse } = require("../utils/apiResponse");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const getCategoriesHandler = async (req, res, next) => {
  try {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : null;
    const data = await getCategories(departmentId);
    return successResponse(res, 200, "Categories fetched successfully.", data);
  } catch (error) {
    next(error);
  }
};

const createCategoryHandler = async (req, res, next) => {
  try {
    const payload = { ...req.body, departmentId: Number(req.body.departmentId) };
    const data = await createCategory(payload);
    return successResponse(res, 201, "Category created successfully.", data);
  } catch (error) {
    next(error);
  }
};

const updateCategoryHandler = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.departmentId) payload.departmentId = Number(payload.departmentId);

    const data = await updateCategory(Number(req.params.id), payload);
    return successResponse(res, 200, "Category updated successfully.", data);
  } catch (error) {
    next(error);
  }
};

const deleteCategoryHandler = async (req, res, next) => {
  try {
    await deleteCategory(Number(req.params.id));
    return successResponse(res, 200, "Category deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};