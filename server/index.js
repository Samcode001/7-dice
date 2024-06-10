import express from "express";
const app = express();
const port = 3000;
import gameRoutes from "./routes/game.js";
import userRoutes from "./routes/user.js";
import { dbConnet } from "./DB/connection.js";
import dotenv from "dotenv";
import cors from "cors";

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/game", gameRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

dbConnet();
