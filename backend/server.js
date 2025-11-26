const app = require("./app");
const connectDatabase = require("./db/database");
const { scheduleUserCleanup } = require("./utils/cleanup");
require("events").EventEmitter.defaultMaxListeners = 20;

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for handling uncaught Exception`);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

connectDatabase();

// Server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  scheduleUserCleanup();
});

// Unhandled promise
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting the server for unhandlied promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
