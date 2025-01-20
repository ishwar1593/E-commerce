import { Router } from "express";
import { deleteUser, getAllUsersForAdmin, updateUserRole } from "../../controllers/admin/user.admin.controller.js";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// Admin Routes
router.get("/users", verifyJwt, isAdmin, getAllUsersForAdmin);
router.patch("/user/updateRole", verifyJwt, isAdmin, updateUserRole);
router.delete("/user/delete/:userId", verifyJwt, isAdmin, deleteUser);
export default router;
