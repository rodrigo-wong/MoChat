const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userControllers = require("./controllers/userControllers");
const chatControllers = require("./controllers/chatControllers");
const messageControllers = require("./controllers/messageControllers");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json()); //to accept JSON data

app.use("/api/user", userControllers);
app.use("/api/chat", chatControllers);
app.use("/api/message", messageControllers);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingtTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(socket.id + " joined room: " + chatId);
  });

  socket.on('new message', (newMessageReceived)=> {
    var chat = newMessageReceived.chat;
    if(!chat.users) return (console.log('chat.users not defined'));

    chat.users.forEach(user => {
        if (user._id == newMessageReceived.sender._id) return;

        socket.in(user._id).emit('message received', newMessageReceived)
    });
  })

  socket.off('setup', ()=> {
    console.log("User disconnected");
    socket.leave(userData._id)
  })
});
