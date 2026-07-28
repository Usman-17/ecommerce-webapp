import express from "express";

const router = express.Router();

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategory,
  getSubCategoriesByCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

router.get("/all", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.get("/:id", getSubCategory);

// Admin Routes
router.post("/create", protectRoute, isAdmin, createSubCategory);
router.put("/update/:id", protectRoute, isAdmin, updateSubCategory);
router.delete("/:id", protectRoute, isAdmin, deleteSubCategory);

export default router;
