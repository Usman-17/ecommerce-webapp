import express from "express";
import {
  isAdmin,
  protectRoute,
  optionalAuth,
} from "../middlewares/authMiddleware.js";
import {
  allOrders,
  cancelWebOrder,
  placeOrder,
  recentOrders,
  trackOrder,
  updateOrderStatus,
  userOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/place", optionalAuth, placeOrder);
router.get("/userorders", protectRoute, userOrders);
router.put("/status/:id", protectRoute, updateOrderStatus);
router.get("/track", trackOrder);
router.post("/cancel", cancelWebOrder);

// Admin Routes
router.get("/all", protectRoute, isAdmin, allOrders);
router.get("/recent", protectRoute, isAdmin, recentOrders);

export default router;
