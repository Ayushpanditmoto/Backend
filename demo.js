// //Pure http server
// const http = require('http');

// const todos = [
//   { id: 1, text: 'Todo One' },
//   { id: 2, text: 'Todo Two' },
//   { id: 3, text: 'Todo Three' },
// ];
// const server = http.createServer((req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('X-powered-By', 'Node.js');
//   //   res.write('Hello World');
//   //   res.write('<h1>Hello World</h1>');
// res.writeHead(200, {
//   'Content-Type': 'application/json',
//   'X-powered-By': 'Node.js',
// });
//   //   const { headers, method, url } = req;
//   //   console.log(headers, method, url);
//   res.end(
//     JSON.stringify({
//       success: true,
//       data: todos,
//     })
//   );
// });
// server.listen(3000, () => {
//   console.log(`Server is running on port http://localhost:3000`);
// });
