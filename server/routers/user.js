import express from "express";
import {login, register, verify} from "../controllers/user.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify").post(isAuthenticated,verify)

export default router;