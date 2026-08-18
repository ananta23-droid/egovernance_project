const express = require("express");
const {
  createApplicationHandler,
  trackApplicationHandler,
  getMyApplicationsHandler,
  getApplicationByIdHandler,
} = require("../controllers/applicationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Optional authentication middleware — allows guest applications as well as logged in citizens
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  return authenticate(req, res, next);
};

router.post("/", optionalAuthenticate, createApplicationHandler);
router.get("/track/:appNumber", trackApplicationHandler);
router.get("/my-applications", optionalAuthenticate, getMyApplicationsHandler);
router.get("/:id", getApplicationByIdHandler);

module.exports = router;
