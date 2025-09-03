const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const cors = require("cors");
require("dotenv").config({
  path: require("path").resolve(__dirname, "config/.env"),
});     

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);
app.use(ErrorHandler);

module.exports = app;
