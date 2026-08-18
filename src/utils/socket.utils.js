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

    socket.on("joinConversation", (convId) => {
      socket.join(convId);
    });

    socket.on("leaveConversation", (convId) => {
      socket.leave(convId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: " + socket._userId);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("socket not initialized");
  return io;
};

export { initSocket, getIO };
