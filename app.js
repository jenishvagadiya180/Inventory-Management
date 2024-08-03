import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/connection.js";
import { report } from "./routes/index.js";
import { errorhandler } from "./error/index.js";
import { product } from "./routes/index.js";
dotenv.config();
const app = express();
const port = process.env.PORT;

//Database Connection
connectDatabase();

app.use(express.json());
app.use("/reports", report);
app.use("/products", product);
app.use(errorhandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
