import express from "express";
import dotenv from "dotenv";
import router from "./routes/admin.js";
import userRouter from "./routes/user.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/admin", router);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected");
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
}

main();
