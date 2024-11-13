const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = ["http://localhost:5173"];
const options = {
  origin: allowedOrigins,
};

let users = {};

io.use((socket, next) => {
  const key = socket.handshake.query.key;

  if (!key) {
    return;
  } else {
    socket.join(key);
    console.log(`User ${socket.id} joined room ${key}`);
    if (!users[key]) {
      users[key] = [];
    }
    users[key].push(socket.id);
    // sub.subscribe("MESSAGES");

    next();
  }
});

io.on("connect", (socket) => {
  socket.on("send-message", async ({ message, reciever }) => {
    io.to(reciever).emit("messages", message);
    //Publish the message to valkey channel
    // await pub.publish("MESSAGES", JSON.stringify({ message, reciever }));

    // sub.on("message", (channel, message) => {
    //   const newMessage = JSON.parse(message);
    //   if (channel === "MESSAGES") {
    //     io.to(newMessage.reciever).emit("messages", newMessage);
    //   }
    // });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from the room tracking (optional for simplicity)
    for (const room in users) {
      users[room] = users[room].filter((id) => id !== socket.id);
    }
  });
});

app.use(express.json());
app.use(cors(options));

server.listen(PORT, () => console.log(`Server is running ${PORT}.`));
