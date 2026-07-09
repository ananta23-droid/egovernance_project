const { verifyToken } = require("../config/jwt");
const ApiError = require("../utils/apiError");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token missing.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
};

module.exports = { authenticate };