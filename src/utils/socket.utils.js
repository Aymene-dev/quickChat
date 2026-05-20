import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    socket._userId = decoded.userId
    
    console.log("user connected: " + socket._userId);

    socket.on("joinConversation", (convId) => {
      socket.join(convId);
      console.log("user joined the conversation: " + convId);
    });

    socket.on("leaveConversation", (convId) => {
      socket.leave(convId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: " + socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("socket not initialized");
  return io;
};

export { initSocket, getIO };
