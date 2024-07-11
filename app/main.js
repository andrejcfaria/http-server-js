  const net = require('net');
  const fs = require('fs')



  const server = net.createServer((socket) => {
    socket.on('close', () => {
      socket.end();
    });


    socket.on('data', (data) => {
     
      const requestData = data.toString();
        
   

      const [requestLine, ...headerLines] = requestData.split('\r\n');
      const [method, path, protocol] = requestLine.split(' ');

       const file = fs.readFileSync(`./app${path}`, (err) => console.log(err));
    

      console.log(headerLines)
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
      } else if (
        method === 'GET' &&
        path !== '/user-agent' &&
        path.includes('echo')
      ) {
        const body = path.split('/')[2];
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}
  `);
      } else if (method === 'GET' && path && file) {
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
      } else {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      }
    });
  });

  server.listen(4221, 'localhost', () => {
    console.log('Server listening on localhost:4221');
  });
