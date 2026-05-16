import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./db/index.js";
dbConnection();
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`test ${port}`);
});
