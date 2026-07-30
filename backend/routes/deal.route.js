import express from "express";

const router = express.Router();

import {
  createDeal,
  deleteDeal,
  getAllDeals,
  getDeal,
  getDealBySlug,
  updateDeal,
} from "../controllers/deal.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

router.get("/all", getAllDeals);
router.get("/slug/:slug", getDealBySlug);
router.get("/:id", getDeal);

// Admin Routes
router.post("/create", protectRoute, isAdmin, createDeal);
router.put("/update/:id", protectRoute, isAdmin, updateDeal);
router.delete("/:id", protectRoute, isAdmin, deleteDeal);

export default router;
