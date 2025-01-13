import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getUserCart,
  removeFromCart,
} from "../../controllers/user/cart.controller.js";

const router = Router();

// Client Routes
router.get("/", verifyJwt, getUserCart);
router.post("/add-cart", verifyJwt, addToCart);
router.delete("/remove-item", verifyJwt, removeFromCart);
router.delete("/clear-cart", verifyJwt, clearCart);

export default router;
