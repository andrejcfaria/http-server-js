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
    console.log(headerLines);
    // const a = headerLines.split(",").map(([k,v]) => (
    //   console.log(k,v)
    // ))
    let h = {};
    headerLines.forEach((line) => {
      const [k, v] = line.split(': ');
      if (k && v) {
        return (h[k] = v);
      }
    });

    const userAgent = h['User-Agent'];

    if (method === 'GET' && path === '/user-agent') {
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}
`);
    }
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Server listening on localhost:4221');
});
