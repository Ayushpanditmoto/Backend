//Pure http server
// const http = require('http');
// const server = http.createServer((req, res) => {
//   res.end('Hello World');
// });
// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`);
});
