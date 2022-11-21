const express = require('express');
const app = express();
//Load env variables
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 3000; // console.log(typeof process.env.PORT);
const morgan = require('morgan');
const mongoose = require('mongoose');
require('colors');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// const logger = require('./middleware/logger');
// app.use(logger);

//Load routes
const bootcamps = require('./routes/bootcampsRoutes');
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode at http://localhost:${port}`
      .bgBlue
  );
});

//connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // it
  })
  .then(() => console.log(`MongoDB Connected`.bgGreen))
  .catch((err) => console.log(`MongoDB Connection Error: ${err}`.bgRed));
