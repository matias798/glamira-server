const dotenv = require("dotenv");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");

//load .env file
dotenv.config();

// import routes
var indexRouter = require("./routes/index");
var userRouter = require("./routes/User");

// connect to mongodb
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  } catch (error) {
    console.log(error);
  }
})();

var app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  cors({
    origin: [
      "https://www.section.io",
      "https://www.google.com/",
      "https://glamira-frontend.web.app",
    ],
  });
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);

module.exports = app;
