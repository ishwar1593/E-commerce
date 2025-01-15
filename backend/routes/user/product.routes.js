import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  searchProduct,
  updateProduct,
  getProductById,
  getAllProducts,
} from "../../controllers/user/product.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { verifyJwt, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/search", searchProduct);
router.post(
  "/addProduct",
  verifyJwt,
  isAdmin,
  upload.array("photos", 3),
  addProduct
);
router.put(
  "/updateProduct/:productId",
  verifyJwt,
  isAdmin,
  upload.array("photos", 3),
  updateProduct
);
router.delete("/deleteProduct/:ws_code", verifyJwt, isAdmin, deleteProduct);
router.get("/:id", getProductById);
router.get("/", getAllProducts);

export default router;
