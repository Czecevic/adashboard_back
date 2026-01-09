import dotenv from "dotenv";
dotenv.config();
import express from "express";
import tasksRouter from "./routes/themes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/themes", tasksRouter);

app.listen(3000, () => {
  console.log("port 3000");
});
