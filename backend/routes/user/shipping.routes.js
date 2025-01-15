import { Router } from "express";
import {
  createShipping,
  deleteDefaultShippingAddress,
  getDefaultShippingAddress,
  updateDefaultShippingAddress,
} from "../../controllers/user/shipping.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router();

// Client Routes
router.post("/create-shipping", verifyJwt, createShipping);
router.get("/get-default", verifyJwt, getDefaultShippingAddress);
router.patch(
  "/update-default/:userId",
  verifyJwt,
  updateDefaultShippingAddress
);
router.delete("/delete/:userId", verifyJwt, deleteDefaultShippingAddress);

export default router;
