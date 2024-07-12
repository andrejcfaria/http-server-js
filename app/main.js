const fs = require('fs');
const net = require('net');
const pathModule = require('path')
console.log('Logs from your program will appear here!');

const server = net.createServer((socket) => {
  socket.on('close', () => {
    socket.end();
  });
  socket.on('data', (data) => {
    const req = data.toString();
    const path = req.split(' ')[1];
    const method = req.split(' ')[0];

    if (path.includes('/files/') && method == 'POST') {
      const body = req.split('\r\n\r\n')[1];
      console.log(body);

      const dir = '/tmp/files'; // Use /tmp as the temporary directory
      const filePath = pathModule.join(dir, 'filer.txt');

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
      }

      // Write the body content to the file
      fs.writeFile(filePath, body, (err) => {
        if (err) {
          console.log(err);
        } else {
            const res = 'HTTP/1.1 201 Created\r\n\r\n';
      socket.write(res);
          console.log('File written successfully');
        }
      });

      console.log(path);
    
      // return
    }
    else if (path === '/') socket.write('HTTP/1.1 200 OK\r\n\r\n');
    // else if (path === "/user-agent") {
    else if (path.startsWith('/files/')) {
      const directory = process.argv[3];
      const filename = path.split('/files/')[1];
      if (fs.existsSync(`${directory}/${filename}`)) {
        const content = fs.readFileSync(`${directory}/${filename}`).toString();
        const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
        socket.write(res);
      } else {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      }
    } else if (path === '/user-agent') {
      req.split('\r\n').forEach((line) => {
        if (line.includes('User-Agent')) {
          const res = line.split(' ')[1];
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}\r\n`
          );
        }
      });
    } else if (path.startsWith('/echo/')) {
      const res = path.split('/echo/')[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}\r\n\r`
      );
    } else socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.end();
  });
});
server.listen(4221, 'localhost');
