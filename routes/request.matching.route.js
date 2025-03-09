import express from "express"
// import dotenv from "dotenv"
// import {login, signup, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, signupAgent, updateAgent} from '../controllers/auth.controller.js'
// import { verifyToken } from "../middleware/verifyToken.js";
import {createRequest, getUserRequests, getAgentRequests } from "../controllers/request.matching.controller.js"

const router = express.Router();


router.post("/create-request",createRequest);

router.get("/create-request",(req, res)  => {
    res.send("Hey")
});
router.get("/matchings/:userId", getUserRequests);
router.get("/user-matchings/:agentId", getAgentRequests);


export default router