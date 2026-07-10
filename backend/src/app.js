const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

// Root route (add this)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SewaBot API is running.",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy." });
});

app.use("/api/v1", routes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;