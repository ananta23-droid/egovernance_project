const express = require("express");
const { askChatbot } = require("../controllers/chatbotController");

const router = express.Router();

// Public for now (you can protect later)
router.post("/ask", askChatbot);

module.exports = router;