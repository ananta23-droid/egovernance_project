const ApiError = require("../utils/apiError");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, "Unauthorized access."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions."));
    }

    next();
  };
};

module.exports = { authorizeRoles };