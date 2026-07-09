const express = require("express");
const authRoutes = require("./authRoutes");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);

// Test protected route for Day 3 validation
router.get("/auth/me", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected route accessed.",
    data: { user: req.user },
  });
});

module.exports = router;