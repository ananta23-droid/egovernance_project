const express = require("express");
const authRoutes = require("./authRoutes");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);

// Auth check
router.get("/auth/me", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected route accessed.",
    data: { user: req.user },
  });
});

// Admin-only test endpoint for Day 4
router.get("/admin/test", authenticate, authorizeRoles("ADMIN"), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Admin. Authorization is working.",
  });
});

module.exports = router;