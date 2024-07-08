const net = require('net');

const server = net.createServer((socket) => {
  
  socket.on('close', () => {
    socket.end();
    server.close();
  });

  socket.on('data', (data) => {
    const [m, path, proto] = data.toString().split('\r\n')[0].split(' ');
    console.log(path);
    if (path === '/') {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
    } else {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    }
  });
});
server.listen(4221, 'localhost');
