import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "../../controllers/user/order.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router();

// Client Routes
router.post("/create-order", verifyJwt, createOrder);
router.get("/user", verifyJwt, getOrdersByUserId);
router.get("/:orderId", verifyJwt, getOrderById);

export default router;
