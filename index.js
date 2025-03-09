import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServerlessExpress } from "@vendia/serverless-express"; // Needed for Vercel functions
import { connectDB } from "./DB/connect.js";
import authRoutes from "./routes/auth.route.js";
import requestRoutes from "./routes/request.matching.route.js";
import editRoutes from "./routes/edit.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    origin: ["https://waka-agent.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/edit", editRoutes);
app.get("/", (req, res) => {
  res.send("Hi");
});

// // Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// Export for Vercel serverless function
export default createServerlessExpress({ app });
