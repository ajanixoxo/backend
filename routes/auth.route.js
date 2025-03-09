 import express from "express"
// import dotenv from "dotenv"
import {login, signup, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, signupAgent, updateAgent} from '../controllers/auth.controller.js'
import { verifyToken } from "../middleware/verifyToken.js";


 const router = express.Router();

router.get("/check-auth",verifyToken  ,checkAuth)


router.post("/signup",signup)
router.post("/signup-agent",signupAgent)
router.post("/login", login)
router.post("/logout", logout)
router.post("/agent-verification", updateAgent)


router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post(`/reset-password/:token`, resetPassword)


// other route

export default router