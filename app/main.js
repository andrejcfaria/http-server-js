const net = require('net');

const server = net.createServer((socket) => {
  socket.on('close', () => {
    socket.end();
    server.close();
  });

  socket.on('data', (data) => {
    const requestData = data.toString();
    console.log(requestData);

    const [requestLine, ...headerLines] = requestData.split('\r\n');
    const [method, path, protocol] = requestLine.split(' ');

    // Parse headers into an object
    const headers = {};
    headerLines.forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        headers[key] = value;
      }
    });

    // Get User-Agent header
    const userAgent = headers['User-Agent'];

    // Log User-Agent for debugging
    console.log('userAgent', userAgent);

    if (userAgent) {
      const contentLength = userAgent.length;

      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}`
      );
    } else {
      // Handle the case where User-Agent header is missing
      socket.write(
"HTTP/1.1 200 OK\r\n\r\n"
      );
    }
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Server listening on localhost:4221');
});
