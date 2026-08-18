const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const isPrismaConnectionError = require("./utils/isPrismaConnectionError");

const app = express();

app.use(
cors({
origin: [
"http://localhost:5173",
"https://nf4bq9qt-5173.inc1.devtunnels.ms",
],
credentials: true,
})
);

// Request logger
app.use((req, res, next) => {
console.log(
`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
);
next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.status(200).json({
success: true,
message: "SewaBot API is running.",
});
});

app.get("/health", (req, res) => {
res.status(200).json({
success: true,
message: "Server is healthy.",
});
});

app.use("/api/v1", routes);

// 404 fallback
app.use((req, res) => {
res.status(404).json({
success: false,
message: "Route not found.",
});
});

// Error handler
app.use((err, req, res, next) => {
const statusCode = isPrismaConnectionError(err)
? 503
: err.statusCode || 500;

const message = isPrismaConnectionError(err)
? "Database is unavailable. Please check backend database credentials in backend/.env."
: err.message || "Internal Server Error";

console.error("Error:", err);

res.status(statusCode).json({
success: false,
message,
});
});

module.exports = app;
