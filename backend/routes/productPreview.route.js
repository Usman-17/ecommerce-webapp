import express from "express";
import { productPreview } from "../controllers/productPreview.controller.js";

const router = express.Router();

router.get("/:slug", productPreview);

export default router;
