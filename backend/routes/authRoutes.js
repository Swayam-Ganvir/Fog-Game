import express from "express"
import { registerUser } from "../controller/auth/registerUser.js";
import { loginUser } from "../controller/auth/loginUser.js";
import { userLogout } from "../controller/auth/logoutUser.js";


const router = express.Router()

// Public Routes
router.post("/userRegister", registerUser);
router.post("/userLogin", loginUser);
router.post("/userLogout", userLogout)
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword)





export default router;