const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("server started");
});

wss.on("connection", (connection) => {
  console.log("someone is here");
  connection.on("message", (message) => {
    console.log("server message", message);
    wss.clients.forEach((client) => {
      if (client !== connection && client.readyState === WebSocket.OPEN)
        client.send(message);
    });
  });
});
