import { Router } from "express";
import { getAllUsersForAdmin } from "../../controllers/admin/user.admin.controller.js";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// Admin Routes
router.get("/users", verifyJwt, isAdmin, getAllUsersForAdmin);
export default router;
