const net = require('net');

const server = net.createServer((socket) => {
  
  socket.on('close', () => {
    socket.end();
    server.close();
  });

  socket.on('data', (data) => {
    const [m, path, proto] = data.toString().split('\r\n')[0].split(' ');
   const id = path.split("/")[1]
   console.log(id.length)
  
    
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${id.length + 1}\r\n\r\n${id}`);
   
   
  });
});
server.listen(4221, 'localhost');
