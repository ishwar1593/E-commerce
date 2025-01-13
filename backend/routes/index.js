import { Router } from "express";
import userRoutes from "./user/user.routes.js";
import productRoutes from "./user/product.routes.js";
import userAdminRoutes from "./admin/user.admin.routes.js"
import cartRoutes from "./user/cart.routes.js"

const router = Router();

// Admin side
router.use("/api/v1/admin", userAdminRoutes)


// Client side
router.use("/api/v1/user", userRoutes);
router.use("/api/v1/product", productRoutes);
router.use("/api/v1/cart", cartRoutes);

export default router;
