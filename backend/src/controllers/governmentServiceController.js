const { successResponse } = require("../utils/apiResponse");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../services/governmentService");

const getServicesHandler = async (req, res, next) => {
  try {
    const data = await getServices(req.query);
    return successResponse(res, 200, "Services fetched successfully.", data);
  } catch (error) {
    next(error);
  }
};

const getServiceByIdHandler = async (req, res, next) => {
  try {
    const data = await getServiceById(Number(req.params.id));
    return successResponse(res, 200, "Service fetched successfully.", data);
  } catch (error) {
    next(error);
  }
};

const createServiceHandler = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      departmentId: Number(req.body.departmentId),
      categoryId: Number(req.body.categoryId),
    };
    const data = await createService(payload);
    return successResponse(res, 201, "Service created successfully.", data);
  } catch (error) {
    next(error);
  }
};

const updateServiceHandler = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.departmentId) payload.departmentId = Number(payload.departmentId);
    if (payload.categoryId) payload.categoryId = Number(payload.categoryId);

    const data = await updateService(Number(req.params.id), payload);
    return successResponse(res, 200, "Service updated successfully.", data);
  } catch (error) {
    next(error);
  }
};

const deleteServiceHandler = async (req, res, next) => {
  try {
    await deleteService(Number(req.params.id));
    return successResponse(res, 200, "Service deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicesHandler,
  getServiceByIdHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
};