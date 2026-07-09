const express = require("express");
const routes = require("./routes");
const ApiError = require("./utils/apiError");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy." });
});

app.use("/api/v1", routes);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;