const fs = require("fs");
const net = require("net");
const path = require("path");

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  console.log("New connection established");

  socket.on("close", () => {
    console.log("Connection closed");
    socket.end();
  });

  socket.on("data", (data) => {
    const req = data.toString();
    console.log(`Received request: ${req}`);
    const requestPath = req.split(" ")[1];

    if (requestPath === "/") {
      fs.readFile("/home/andrefaria/48ed43726f7cdf54/my-docker-app/app/index.html", (err, content) => {
        if (err) {
          console.error(`Error reading index.html: ${err}`);
          socket.write("HTTP/1.1 500 Internal Server Error\r\nContent-Length: 0\r\n\r\n");
          socket.end();
          return;
        }
        const res = `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
        socket.write(res);
        socket.end();
      });
    } else if (requestPath.startsWith("/files/")) {
      const directory = process.argv[3];
      const filename = requestPath.split("/files/")[1];
      const filePath = path.join(directory, filename);

      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error(`Error reading file ${filePath}: ${err}`);
          socket.write("HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n");
        } else {
          const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n`;
          socket.write(res);
          socket.write(content);
        }
        socket.end();
      });
    } else if (requestPath === "/user-agent") {
      let userAgent = '';
      req.split("\r\n").forEach((line) => {
        if (line.startsWith("User-Agent:")) {
          userAgent = line.split(": ")[1];
        }
      });
      if (userAgent) {
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
      } else {
        socket.write("HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n");
      }
      socket.end();
    } else if (requestPath.startsWith("/echo/")) {
      const message = requestPath.split("/echo/")[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`);
      socket.end();
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n");
      socket.end();
    }
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err}`);
  });
});

server.listen(4222, "0.0.0.0", () => {
  console.log("Server listening on port 4222");
});
