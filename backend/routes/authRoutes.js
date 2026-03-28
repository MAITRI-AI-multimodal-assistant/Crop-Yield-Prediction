import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
sendVerificationCode,
googleLogin   

} from "../controllers/authController.js";

const router = express.Router();

// 🔥 3 main routes
router.post("/register", registerUser);   // all roles
router.post("/login", loginUser);         // all roles
router.post("/admin/login", adminLogin);  // only admin
router.post("/send-verification", sendVerificationCode); //verify
router.post("/google-login", googleLogin);


export default router;