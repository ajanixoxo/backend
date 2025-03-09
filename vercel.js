// This file is needed to provide an entry point for Vercel
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./DB/connect.js"
import authRoutes from "./routes/auth.route.js"
import requestRoutes from "./routes/request.matching.route.js"
import editRoutes from "./routes/edit.route.js"

dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(
  cors({
    origin: ["https://waka-agent.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Connect to database for serverless function
// This is important - we need to connect on each function invocation
let isConnected = false
const connectToDatabase = async () => {
  if (isConnected) return
  try {
    await connectDB()
    isConnected = true
    console.log("MongoDB connected in serverless function")
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

// API routes
app.use("/api/auth", async (req, res, next) => {
  await connectToDatabase()
  return authRoutes(req, res, next)
})

app.use("/api/request", async (req, res, next) => {
  await connectToDatabase()
  return requestRoutes(req, res, next)
})

app.use("/api/edit", async (req, res, next) => {
  await connectToDatabase()
  return editRoutes(req, res, next)
})

// Export the Express app as the default export
export default app

