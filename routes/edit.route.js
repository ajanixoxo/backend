import express from "express";
import { editUsersProfile, editAgentsProfile } from "../controllers/edit.controller.js";

const router = express.Router()


router.post("/user-profile", editUsersProfile)
router.post("/agent-profile", editAgentsProfile)


export default router