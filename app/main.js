const net = require("net");

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n\r\n");
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", data => {
    const [m, path, proto] = data.toString().split('\r\n')[0].split(" ")
    if(path === '/') return socket.write('HTTP/1.1 200 OK\r\n\r\n');
    return socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  })
});
server.listen(4221, "localhost");
