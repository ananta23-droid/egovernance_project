const express = require("express");
const authRoutes = require("./authRoutes");
const departmentRoutes = require("./departmentRoutes");
const categoryRoutes = require("./categoryRoutes");
const governmentServiceRoutes = require("./governmentServiceRoutes");
const chatbotRoutes = require("./chatbotRoutes");
const applicationRoutes = require("./applicationRoutes");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", governmentServiceRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/applications", applicationRoutes);

router.get("/admin/test", authenticate, authorizeRoles("ADMIN"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Admin. Authorization is working." });
});

module.exports = router;