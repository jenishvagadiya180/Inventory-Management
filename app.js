import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/connection.js";
import errorhandler from "./error/handler.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//Database Connection
connectDatabase();

app.use(express.json());
app.use(errorhandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
