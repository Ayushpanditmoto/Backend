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
const errorHandler = require("./middleware/errorHandler");
require("colors");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
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
