const express = require('express');
const app = express();
//Load env variables
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 3000;
// console.log(typeof process.env.PORT);

//Load routes
const bootcamps = require('./routes/bootcampsRoutes');
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode at http://localhost:${port}`
  );
});
