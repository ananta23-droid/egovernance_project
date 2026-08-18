const chatbotService = require("../services/chatbotService");

const askChatbot = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await chatbotService.ask(question.trim());

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process chatbot request.",
    });
  }
};

module.exports = {
  askChatbot,
};