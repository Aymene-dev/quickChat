import express from "express";
import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./db/index.js";
dbConnection();

import authRoutes from "./routes/auth.routes.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`test ${port}`);
});
