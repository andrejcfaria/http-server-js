const net = require('net');

const server = net.createServer((socket) => {
  socket.on('close', () => {
    socket.end();
    server.close();
  });

  socket.on('data', (data) => {
    console.log(data.toString())
    const [m, path, proto] = data.toString().split('\r\n')[0].split(' ');
    const userAgent = data.toString().split('\r\n')[3].split(":")[1]
    console.log(userAgent)
    
    
    

    const id = path.split('/')[2];

    if (path === '/') {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
    } else if (id) {
      const l = userAgent.length;
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${l}\r\n\r\n${userAgent}`
      );
    } else {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    }
  });
});
server.listen(4221, 'localhost');
