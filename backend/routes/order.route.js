import express from "express";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";
import {
  allOrders,
  cancelWebOrder,
  placeOrder,
  trackOrder,
  updateOrderStatus,
  userOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/place", placeOrder);
router.get("/userorders", protectRoute, userOrders);
router.put("/status/:id", protectRoute, updateOrderStatus);
router.get("/track", trackOrder);
router.post("/cancel", cancelWebOrder);

// Admin Routes
router.get("/all", protectRoute, isAdmin, allOrders);

export default router;
