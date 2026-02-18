import express from "express";
import dotenv from "dotenv";
import router from "./routes/admin.js";
import userRouter from "./routes/user.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/admin", router);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.get("/test", (req, res)=>{
  res.json({msg:"Server is running."})
})

async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://hiddenxworld_db_user:bJPMNXFdJuSqgyJ9@cluster0.5lepnmw.mongodb.net/Inventry");
    console.log("Database connected");

    const PORT = 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}

startServer();
