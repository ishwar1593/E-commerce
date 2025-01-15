import { Router } from "express";
import {
  createUser,
  forgotPassword,
  loginUser,
  logout,
  resetPassword,
  verifyOTP,
  getUserById,
} from "../../controllers/user/user.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router();

// Client Routes
router.post("/signup", createUser);
router.get("/:id", verifyJwt, getUserById);

router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

export default router;
