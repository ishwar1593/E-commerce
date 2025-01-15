import { Router } from "express";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";
import { getAllShipping, getShippingByUserId } from "../../controllers/admin/shipping.admin.controller.js";

const router = Router();

// Admin Routes
router.get("/", verifyJwt, isAdmin, getAllShipping);
router.get("/:id", verifyJwt, isAdmin, getShippingByUserId);

export default router;
