import { Router } from "express";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";
import { getAllOrders, updateOrderStatus } from "../../controllers/admin/order.admin.controller.js";

const router = Router();

// Admin Routes
router.get("/", verifyJwt, isAdmin, getAllOrders);
router.patch("/update-status", verifyJwt, isAdmin, updateOrderStatus);

export default router;