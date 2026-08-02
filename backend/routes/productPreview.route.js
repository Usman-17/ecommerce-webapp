import express from "express";
import { productPreview } from "../controllers/productPreview.controller.js";

const router = express.Router();

router.get("/:slug", (req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  next();
}, productPreview);

export default router;
