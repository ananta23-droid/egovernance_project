const { verifyToken } = require("../config/jwt");
const ApiError = require("../utils/apiError");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization token missing."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

module.exports = { authenticate };