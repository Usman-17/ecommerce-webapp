import express from "express";
const router = express.Router();

import {
  addAddress,
  deleteAddress,
  forgotPassword,
  getAddresses,
  getUser,
  googleAuth,
  logout,
  resetPassword,
  setDefaultAddress,
  signup,
  updateAddress,
  updateProfile,
  userLogin,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

// Auth routes
router.post("/signup", signup);
router.post("/login", userLogin);
router.post("/google", googleAuth);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected user routes
router.get("/user", protectRoute, getUser);
router.put("/profile/update", protectRoute, updateProfile);

// Address routes
router.get("/addresses", protectRoute, getAddresses);
router.post("/addresses", protectRoute, addAddress);
router.put("/addresses/:id", protectRoute, updateAddress);
router.delete("/addresses/:id", protectRoute, deleteAddress);
router.put("/addresses/:id/default", protectRoute, setDefaultAddress);

export default router;
