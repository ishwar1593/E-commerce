import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../../controllers/user/category.controller.js";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJwt, getAllCategories);
router.get("/:categoryId", verifyJwt, getCategoryById);

export default router;
