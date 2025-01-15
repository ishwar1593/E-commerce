import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../controllers/admin/category.admin.controller.js";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-category", verifyJwt, isAdmin, createCategory);
router.patch("/update-category/:categoryId", verifyJwt, isAdmin, updateCategory);
router.delete("/delete-category/:categoryId", verifyJwt, isAdmin, deleteCategory);

export default router;
