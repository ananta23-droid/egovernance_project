const CONNECTION_ERROR_CODES = new Set(["P1000", "P1001", "P1010"]);

const isPrismaConnectionError = (error) => {
  if (!error) return false;

  if (CONNECTION_ERROR_CODES.has(error.code)) return true;

  const message = String(error.message || "");
  return (
    message.includes("Authentication failed against database server") ||
    message.includes("Can't reach database server") ||
    message.includes("Access denied for user")
  );
};

module.exports = isPrismaConnectionError;
