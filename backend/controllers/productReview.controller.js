import ProductReview from "../models/productReview.model.js";
import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";

// PATH     : /api/product-review/admin/all
// METHOD   : GET
// ACCESS   : Admin
// DESC     : Get all product reviews (admin)
export const getAllProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find()
      .populate("product", "title slug")
      .sort({ createdAt: -1 });

    const formatted = reviews.map((r, i) => ({
      _id: r._id,
      sr: i + 1,
      productId: r.product?._id || null,
      productTitle: r.product?.title || "Deleted Product",
      userImage: r.userImage,
      fullName: r.fullName,
      email: r.email,
      mobile: r.mobile,
      rating: r.rating,
      review: r.review,
      date: r.date,
      createdAt: r.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error in getAllProductReviews:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product-review/:productId
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get reviews by product
export const getProductReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    let product = null;

    const isObjectId = productId.match(/^[0-9a-fA-F]{24}$/);
    if (isObjectId) {
      product = await Product.findById(productId).select("_id");
    } else {
      product = await Product.findOne({ slug: productId }).select("_id");
    }

    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviews = await ProductReview.find({ product: product._id }).sort({
      date: -1,
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error in getProductReviewsByProduct:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product-review/create
// METHOD   : POST
// ACCESS   : Admin
// DESC     : Create a product review
export const createProductReview = async (req, res) => {
  try {
    const { productId, fullName, email, mobile, rating, review, date } =
      req.body;

    if (!productId)
      return res.status(400).json({ error: "Product is required" });
    if (!fullName?.trim())
      return res.status(400).json({ error: "Full name is required" });
    if (!rating) return res.status(400).json({ error: "Rating is required" });
    if (!review?.trim())
      return res.status(400).json({ error: "Review is required" });

    let product = null;
    const isObjectId = productId.match(/^[0-9a-fA-F]{24}$/);
    if (isObjectId) {
      product = await Product.findById(productId).select("_id");
    } else {
      product = await Product.findOne({ slug: productId }).select("_id");
    }
    if (!product) return res.status(404).json({ error: "Product not found" });

    let userImage = { public_id: "", url: "" };
    if (req.files?.userImage) {
      const result = await cloudinary.uploader.upload(
        req.files.userImage.tempFilePath,
        { folder: "product-reviews" },
      );
      userImage = { public_id: result.public_id, url: result.secure_url };
    }

    const newReview = new ProductReview({
      product: product._id,
      userImage,
      fullName: fullName.trim(),
      email: email?.trim() || "",
      mobile: mobile?.trim() || "",
      rating: Number(rating),
      review: review.trim(),
      date: date || new Date(),
    });

    await newReview.save();
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    console.error("Error in createProductReview:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product-review/update/:id
// METHOD   : PUT
// ACCESS   : Admin
// DESC     : Update a product review
export const updateProductReview = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await ProductReview.findById(id);
    if (!existing) return res.status(404).json({ error: "Review not found" });

    const { fullName, email, mobile, rating, review, date, productId } =
      req.body;

    if (productId) {
      let product = null;
      const isObjectId = productId.match(/^[0-9a-fA-F]{24}$/);
      if (isObjectId) {
        product = await Product.findById(productId).select("_id");
      } else {
        product = await Product.findOne({ slug: productId }).select("_id");
      }
      if (!product) return res.status(404).json({ error: "Product not found" });
      existing.product = product._id;
    }

    if (req.files?.userImage) {
      if (existing.userImage?.public_id) {
        await cloudinary.uploader.destroy(existing.userImage.public_id);
      }
      const result = await cloudinary.uploader.upload(
        req.files.userImage.tempFilePath,
        { folder: "product-reviews" },
      );
      existing.userImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    if (fullName !== undefined) existing.fullName = fullName.trim();
    if (email !== undefined) existing.email = email.trim();
    if (mobile !== undefined) existing.mobile = mobile.trim();
    if (rating !== undefined) existing.rating = Number(rating);
    if (review !== undefined) existing.review = review.trim();
    if (date !== undefined) existing.date = date;

    await existing.save();
    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error in updateProductReview:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product-review/delete/:id
// METHOD   : DELETE
// ACCESS   : Admin
// DESC     : Delete a product review
export const deleteProductReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await ProductReview.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.userImage?.public_id) {
      await cloudinary.uploader.destroy(review.userImage.public_id);
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProductReview:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product-review/bulk-upload
// METHOD   : POST
// ACCESS   : Admin
// DESC     : Bulk upload reviews via Excel
export const bulkUploadProductReviews = async (req, res) => {
  try {
    if (!req.files?.excelFile) {
      return res.status(400).json({ error: "Excel file is required" });
    }

    const workbook = xlsx.read(req.files.excelFile.tempFilePath, {
      type: "file",
    });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const results = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const productTitle =
          row["Product Title"] ||
          row["productTitle"] ||
          row["Product"] ||
          row["product"];
        const fullName =
          row["Full Name"] || row["fullName"] || row["Name"] || row["name"];
        const email = row["Email"] || row["email"] || "";
        const mobile =
          row["Mobile"] || row["mobile"] || row["Phone"] || row["phone"] || "";
        const rating = Number(row["Rating"] || row["rating"] || 0);
        const reviewText =
          row["Review"] ||
          row["review"] ||
          row["Comment"] ||
          row["comment"] ||
          "";
        const dateVal = row["Date"] || row["date"] || new Date();

        if (!productTitle) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Product Title is required`);
          continue;
        }
        if (!fullName) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Full Name is required`);
          continue;
        }
        if (!rating || rating < 1 || rating > 5) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Rating must be between 1 and 5`);
          continue;
        }
        if (!reviewText) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Review is required`);
          continue;
        }

        let product = null;
        const isObjectId = String(productTitle).match(/^[0-9a-fA-F]{24}$/);
        if (isObjectId) {
          product = await Product.findById(productTitle).select("_id");
        } else {
          product = await Product.findOne({
            title: {
              $regex: new RegExp(`^${String(productTitle).trim()}$`, "i"),
            },
          }).select("_id");
        }

        if (!product) {
          results.failed++;
          results.errors.push(
            `Row ${i + 2}: Product "${productTitle}" not found`,
          );
          continue;
        }

        const date =
          dateVal && !isNaN(new Date(dateVal).getTime())
            ? new Date(dateVal)
            : new Date();

        await ProductReview.create({
          product: product._id,
          userImage: { public_id: "", url: "" },
          fullName: String(fullName).trim(),
          email: String(email).trim(),
          mobile: String(mobile).trim(),
          rating: Number(rating),
          review: String(reviewText).trim(),
          date,
        });

        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    res.json({
      message: `Bulk upload complete: ${results.success} created, ${results.failed} failed`,
      ...results,
    });
  } catch (error) {
    console.error("Error in bulkUploadProductReviews:", error.message);
    res.status(500).json({ error: error.message });
  }
};
