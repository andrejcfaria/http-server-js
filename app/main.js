  const net = require('net');
  const fs = require('fs')
  const p = require('path')



  const server = net.createServer((socket) => {




    socket.on('close', () => {
      socket.end();
    });
    
    
    socket.on('data', (data) => {
      
      const requestData = data.toString();
      
      
      
      const [requestLine, ...headerLines] = requestData.split('\r\n');
      const [method, reqPath, protocol] = requestLine.split(' ');
      
    
      let h = {};
      headerLines.forEach((line) => {
        const [k, v] = line.split(': ');
        if (k && v) {
          return (h[k] = v);
        }
      });

      if (method === 'GET' && reqPath === '/user-agent') {
        const userAgent = h['User-Agent'];
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}
  `);
      } else if (
        method === 'GET' &&
        reqPath !== '/user-agent' &&
        reqPath.includes('echo')
      ) {
        const body = path.split('/')[2];
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}
  `);
      } else if (method === 'GET' && reqPath.startsWith("/files/")) {
        console.log("first")
        const directory = process.argv[3];
      const filename = reqPath.split("/files/")[1];

        // const filePath = p.join('/tmp', path.replace("/files", ""));
   
        
        if(fs.existsSync(`${directory}/${filename}`)) {
          
          console.log("filepath---", `${directory}/${filename}`);
    
       fs.readFile(`${directory}/${filename}`, (err, file) => {

          if(file) {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
          } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
          }
        })
            }
      } else {
         socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    });
  });

  server.listen(4221, 'localhost', () => {
    console.log('Server listening on localhost:4221');
  });
