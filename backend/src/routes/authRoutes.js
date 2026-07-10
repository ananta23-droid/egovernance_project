const express = require("express");
const { register, login } = require("../controllers/authController");
const { validate } = require("../middleware/validateMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

module.exports = router;