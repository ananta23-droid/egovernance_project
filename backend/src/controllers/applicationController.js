const { successResponse } = require("../utils/apiResponse");
const {
  createApplication,
  trackApplication,
  getApplicationsByUser,
  getApplicationById,
} = require("../services/applicationService");

const createApplicationHandler = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const data = await createApplication(req.body, userId);
    return successResponse(
      res,
      201,
      "Application submitted successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

const trackApplicationHandler = async (req, res, next) => {
  try {
    const { appNumber } = req.params;
    const data = await trackApplication(appNumber);
    return successResponse(
      res,
      200,
      "Application tracking details fetched.",
      data
    );
  } catch (error) {
    next(error);
  }
};

const getMyApplicationsHandler = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userEmail = req.user ? req.user.email : req.query.email;
    const data = await getApplicationsByUser(userId, userEmail);
    return successResponse(
      res,
      200,
      "Citizen applications fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

const getApplicationByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getApplicationById(id);
    return successResponse(
      res,
      200,
      "Application details fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplicationHandler,
  trackApplicationHandler,
  getMyApplicationsHandler,
  getApplicationByIdHandler,
};
