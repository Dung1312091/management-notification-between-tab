const express = require("express");
const webserver = express();
const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 443 });
sockserver.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send("connection established");
  ws.on("close", () => console.log("Client has disconnected!"));
  ws.on("message", (data) => {
    sockserver.clients.forEach((client) => {
      console.log(`distributing message: ${data}`);
      client.send(`${data}`);
    });
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});

webserver.get("/send", (req, res) => {
  console.log("do day");

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
  sockserver.clients.forEach((client) => {
    client.send(`${randomCharacter}`);
  });
  res.send(`${randomCharacter}`);
});
webserver.listen(3001, () => console.log(`Listening on ${3001}`));
