import express from "express";
import {
  getAllProductReviews,
  getProductReviewsByProduct,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  bulkUploadProductReviews,
} from "../controllers/productReview.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/all", protectRoute, isAdmin, getAllProductReviews);
router.post("/create", protectRoute, isAdmin, createProductReview);
router.put("/update/:id", protectRoute, isAdmin, updateProductReview);
router.delete("/delete/:id", protectRoute, isAdmin, deleteProductReview);
router.post("/bulk-upload", protectRoute, isAdmin, bulkUploadProductReviews);
router.get("/:productId", getProductReviewsByProduct);

export default router;
