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
    socket._userId = decoded.userId;

    socket.join(socket._userId);

    socket.on("joinConversation", (convId) => {
      socket.join(convId);
    });

    socket.on("leaveConversation", (convId) => {
      socket.leave(convId);
    });

    socket.on("disconnect", () => {});
  });
};

const getIO = () => {
  if (!io) throw new Error("socket not initialized");
  return io;
};

export { initSocket, getIO };
