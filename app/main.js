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
    console.log(method)
    console.log(path)
    console.log(protocol)
    // console.log(headerLines);
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

    
    if (method === 'GET' && path === '/user-agent') {
      const userAgent = h['User-Agent'];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}
`);
    } else if(method === "GET" && path !== '/user-agent' && path.includes("echo")) {
        const body = path.split("/")[2]
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}
`) } else if (method === 'GET' && path === '/') {

    socket.write("HTTP/1.1 200 OK\r\n\r\n")
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    }
  });
});

server.listen(4221, 'localhost', () => {
  console.log('Server listening on localhost:4221');
});
