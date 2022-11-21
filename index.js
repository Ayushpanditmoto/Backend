//Pure http server
// const http = require('http');
// const server = http.createServer((req, res) => {
//   const {headers, method, url} = req;
//   console.log(headers, method, url);
// });
// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

// console.log(typeof process.env.PORT);

app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`);
});
