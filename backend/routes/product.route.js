import express from "express";

const router = express.Router();

import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllproducts,
  getAllProductsAdmin,
  getProduct,
  getProductAdmin,
  getProductBySlug,
  updateProduct,
} from "../controllers/product.controller.js";

router.get("/all", getAllproducts);
router.get("/admin/all", protectRoute, isAdmin, getAllProductsAdmin);
router.get("/admin/:id", protectRoute, isAdmin, getProductAdmin);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProduct);

// Admin Routes
router.post("/create", protectRoute, isAdmin, createProduct);
router.put("/update/:id", protectRoute, isAdmin, updateProduct);
router.delete("/:id", protectRoute, isAdmin, deleteProduct);

export default router;
