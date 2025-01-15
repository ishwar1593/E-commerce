import { Router } from "express";
import userRoutes from "./user/user.routes.js";
import productRoutes from "./user/product.routes.js";
import userAdminRoutes from "./admin/user.admin.routes.js";
import cartRoutes from "./user/cart.routes.js";
import shippingAdminRoutes from "./admin/shipping.admin.routes.js";
import shippingRoutes from "./user/shipping.routes.js";
import orderRoutes from "./user/order.routes.js";
import orderAdminRoutes from "./admin/order.admin.routes.js";
import categoryRoutes from "./user/category.routes.js";
import categoryAdminRoutes from "./admin/category.admin.routes.js";

const router = Router();

// Admin side
router.use("/api/v1/admin", userAdminRoutes);
router.use("/api/v1/admin/shipping", shippingAdminRoutes);
router.use("/api/v1/admin/orders", orderAdminRoutes);
router.use("/api/v1/admin/category", categoryAdminRoutes);

// Client side
router.use("/api/v1/user", userRoutes);
router.use("/api/v1/product", productRoutes);
router.use("/api/v1/cart", cartRoutes);
router.use("/api/v1/shipping", shippingRoutes);
router.use("/api/v1/order", orderRoutes);
router.use("/api/v1/category", categoryRoutes);

export default router;
