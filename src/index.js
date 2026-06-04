import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./db/index.js";
dbConnection();

import authRoutes from "./routes/auth.routes.js";
import convRoutes from "./routes/conversations.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { initSocket } from "./utils/socket.utils.js";
import http from "http";

const app = express();
const port = process.env.PORT;

const server = http.createServer(app);
initSocket(server);
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/auth", authRoutes);
app.use("/conversation", convRoutes);
app.use("/message", messageRoutes);
app.get("/", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`test ${port}`);
});
