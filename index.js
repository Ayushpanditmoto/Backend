const express = require("express");
const app = express();
//Load env variables
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "./config/config.env"),
});
const port = process.env.PORT || 3000; // console.log(typeof process.env.PORT);
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
require("colors");
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//sanitize data
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());
//set security headers
app.use(helmet());
//prevent xss attacks
app.use(xss()); // this middleware should be used after the body parser it will clean the req.body, req.query, and req.params from any user input that contains malicious HTML code.
//rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

//prevent http param pollution
app.use(hpp());

//enable cors
app.use(cors());

// const logger = require('./middleware/logger');
// app.use(logger);

// Cookie parser
app.use(cookieParser());

//Load routes
const bootcamps = require("./routes/bootcampsRoutes");
app.use("/api/v1/bootcamps", bootcamps);
const courses = require("./routes/coursesRoutes");
app.use("/api/v1/courses", courses);
const auth = require("./routes/authRoutes");
app.use("/api/v1/auth", auth);
const users = require("./routes/userRoutes");
app.use("/api/v1/users", users);
const reviews = require("./routes/reviewRoutes");
app.use("/api/v1/reviews", reviews);
app.use(errorHandler); // we add this middleware after the routes so that it will be executed after the routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode at http://localhost:${port}`
      .bgBlue
  );
  //connect to database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // it
    })
    .then(() => console.log(`MongoDB Connected`.bgGreen))
    .catch((err) => console.log(`MongoDB Connection Error: ${err}`.bgRed));
});
