const net = require('net');
const fs = require('fs');
const p = require('path');

const server = net.createServer((socket) => {
  socket.on('close', () => {
    socket.end();
  });

  socket.on('data', (data) => {
    const requestData = data.toString();
    const [requestLine, ...headerLines] = requestData.split('\r\n');
    const [method, requestPath, protocol] = requestLine.split(' ');

    let h = {};
    headerLines.forEach((line) => {
      const [k, v] = line.split(': ');
      if (k && v) {
        h[k] = v;
      }
    });

    if (method === 'GET' && requestPath === '/user-agent') {
      const userAgent = h['User-Agent'];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
    } else if (method === 'GET' && requestPath !== '/user-agent' && requestPath.includes('echo')) {
      const body = requestPath.split('/')[2];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}`);
    } else if (method === 'GET' && requestPath.startsWith("/files/")) {
      const directory = process.argv[3];
      const filename = requestPath.split("/files/")[1];

      const filePath = p.join(directory, filename);

      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, file) => {
          if (err) {
            socket.write("HTTP/1.1 500 Internal Server Error\r\nContent-Length: 0\r\n\r\n");
          } else {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n`);
            socket.write(file);
          }
        });
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n");
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n");
    }
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Server listening on localhost:4221');
});
