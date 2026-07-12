const { successResponse } = require("../utils/apiResponse");
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../services/departmentService");

const getDepartments = async (req, res, next) => {
  try {
    const data = await getAllDepartments();
    return successResponse(res, 200, "Departments fetched successfully.", data);
  } catch (error) {
    next(error);
  }
};

const createDepartmentHandler = async (req, res, next) => {
  try {
    const data = await createDepartment(req.body);
    return successResponse(res, 201, "Department created successfully.", data);
  } catch (error) {
    next(error);
  }
};

const updateDepartmentHandler = async (req, res, next) => {
  try {
    const data = await updateDepartment(Number(req.params.id), req.body);
    return successResponse(res, 200, "Department updated successfully.", data);
  } catch (error) {
    next(error);
  }
};

const deleteDepartmentHandler = async (req, res, next) => {
  try {
    await deleteDepartment(Number(req.params.id));
    return successResponse(res, 200, "Department deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
};