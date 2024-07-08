const net = require('net');

const server = net.createServer((socket) => {
  
  socket.on('close', () => {
    socket.end();
    server.close();
  });

  socket.on('data', (data) => {
    const [m, path, proto] = data.toString().split('\r\n')[0].split(' ');
   console.log(path)
    const id = path.split("/")[2]
   console.log(id)
   const l = (id.length)
   console.log(l)
  
    
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${l}\r\n\r\n${id}`);
   
   
  });
});
server.listen(4221, 'localhost');
