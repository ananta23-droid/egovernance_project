const { registerUser, loginUser } = require("../services/authService");
const { successResponse } = require("../utils/apiResponse");

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await registerUser({ fullName, email, password });

    return successResponse(res, 201, "User registered successfully.", result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    return successResponse(res, 200, "Login successful.", result);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };