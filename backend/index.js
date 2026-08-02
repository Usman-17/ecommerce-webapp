import express from "express";

import dbConnect from "./db/ConnectMongoDB.js";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import cron from "node-cron";
import helmet from "helmet";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import brandRoutes from "./routes/brand.route.js";
import areaRoutes from "./routes/area.route.js";
import categoryRoutes from "./routes/category.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import reviewRoutes from "./routes/review.route.js";
import dealRoutes from "./routes/deal.route.js";
import productReviewRoutes from "./routes/productReview.route.js";
// imports End

const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)
app.use(cookieParser());
app.use(helmet());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://www.jemzy.pk/",
      "https://jemzy-dashboard.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

cron.schedule("0 0 1 * *", async () => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    // Delete Cancelled orders
    const cancelledResult = await Order.deleteMany({
      status: "Cancelled",
      cancelledAt: { $lte: dateThreshold },
    });

    console.log(`Deleted ${cancelledResult.deletedCount} cancelled orders.`);
  } catch (error) {
    console.error("Error in cron job deleting orders:", error);
  }
});

// Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/deal", dealRoutes);
app.use("/api/product-review", productReviewRoutes);

// Running App
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
