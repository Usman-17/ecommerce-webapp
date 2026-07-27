import express from "express";

const router = express.Router();

import {
  createArea,
  deleteArea,
  getAllAreas,
  getArea,
  updateArea,
} from "../controllers/area.controller.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

router.get("/all", getAllAreas);
router.get("/:id", getArea);

// Admin Routes
router.post("/create", protectRoute, isAdmin, createArea);
router.put("/update/:id", protectRoute, isAdmin, updateArea);
router.delete("/:id", protectRoute, isAdmin, deleteArea);

export default router;
