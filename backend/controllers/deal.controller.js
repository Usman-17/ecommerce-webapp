import Deal from "../models/deal.model.js";
import Product from "../models/product.model.js";

import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "DEAL_IMAGES",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteImages = async (images) => {
  for (const img of images) {
    if (img?.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }
};

const formatDeal = (deal) => ({
  _id: deal._id,
  title: deal.title,
  slug: deal.slug,
  description: deal.description,
  dealPrice: deal.dealPrice,
  originalPrice: deal.originalPrice,
  images: deal.images || [],
  products:
    deal.products?.map((p) => ({
      _id: p._id,
      title: p.title,
      price: p.price,
      productImages: p.productImages,
    })) || [],
  productIds:
    deal.products?.map((p) => p._id?.toString?.() || p.toString?.()) || [],
  isActive: deal.isActive,
  createdAt: deal.createdAt,
  updatedAt: deal.updatedAt,
});

// PATH     : /api/deal/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Deal
export const createDeal = async (req, res) => {
  try {
    const { title, description, dealPrice, originalPrice, products, isActive } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Deal title is required" });
    }

    if (!dealPrice || dealPrice <= 0) {
      return res.status(400).json({ error: "Valid deal price is required" });
    }

    // Validate products exist
    let productIds = [];
    if (products) {
      const parsed =
        typeof products === "string" ? JSON.parse(products) : products;
      for (const pid of parsed) {
        const exists = await Product.findById(pid);
        if (!exists) {
          return res.status(400).json({ error: `Product not found: ${pid}` });
        }
      }
      productIds = parsed;
    }

    // Handle multiple images
    const images = [];
    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const file of files) {
        const uploaded = await uploadImage(file);
        images.push(uploaded);
      }
    }

    // Generate slug
    let slug = slugify(title.trim(), { lower: true, strict: true });
    const existingDeal = await Deal.findOne({ slug });
    if (existingDeal) {
      slug = `${slug}-${Date.now()}`;
    }

    const deal = await Deal.create({
      title: title.trim(),
      slug,
      description: description || "",
      dealPrice: Number(dealPrice),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images,
      products: productIds,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : true,
    });

    const populated = await Deal.findById(deal._id).populate("products");
    return res.status(201).json(formatDeal(populated));
  } catch (error) {
    console.error("Error in createDeal controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/deal/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update Deal
export const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dealPrice,
      originalPrice,
      products,
      isActive,
      removedImages,
    } = req.body;

    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    if (title !== undefined) {
      deal.title = title.trim();
      // Regenerate slug if title changed
      let newSlug = slugify(title.trim(), { lower: true, strict: true });
      const existingDeal = await Deal.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (existingDeal) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      deal.slug = newSlug;
    }
    if (description !== undefined) deal.description = description;
    if (dealPrice !== undefined) deal.dealPrice = Number(dealPrice);
    if (originalPrice !== undefined)
      deal.originalPrice = originalPrice ? Number(originalPrice) : undefined;
    if (isActive !== undefined)
      deal.isActive = isActive === "true" || isActive === true;

    // Handle product updates
    if (products !== undefined) {
      const parsed =
        typeof products === "string" ? JSON.parse(products) : products;
      for (const pid of parsed) {
        const exists = await Product.findById(pid);
        if (!exists) {
          return res.status(400).json({ error: `Product not found: ${pid}` });
        }
      }
      deal.products = parsed;
    }

    // Remove old images if requested
    if (removedImages) {
      const toRemove =
        typeof removedImages === "string"
          ? JSON.parse(removedImages)
          : removedImages;
      const removeIds = toRemove.filter(Boolean);
      if (removeIds.length > 0) {
        await deleteImages(removeIds.map((id) => ({ public_id: id })));
        deal.images = deal.images.filter(
          (img) => !removeIds.includes(img.public_id),
        );
      }
    }

    // Add new images
    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const file of files) {
        const uploaded = await uploadImage(file);
        deal.images.push(uploaded);
      }
    }

    await deal.save();
    const populated = await Deal.findById(deal._id).populate("products");
    return res.status(200).json(formatDeal(populated));
  } catch (error) {
    console.error("Error in updateDeal:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/deal/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all deals
export const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate("products")
      .sort({ createdAt: -1 });

    const formatted = deals.map(formatDeal);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getAllDeals:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/deal/slug/:slug
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get deal by slug
export const getDealBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const deal = await Deal.findOne({ slug }).populate("products");
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    return res.status(200).json(formatDeal(deal));
  } catch (error) {
    console.error("Error in getDealBySlug:", error.message);
    return res.status(500).json({ error: "Failed to fetch deal" });
  }
};

// PATH     : /api/deal/:id
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get single deal
export const getDeal = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await Deal.findById(id).populate("products");
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    return res.status(200).json(formatDeal(deal));
  } catch (error) {
    console.error("Error in getDeal:", error.message);
    return res.status(500).json({ error: "Failed to fetch deal" });
  }
};

// PATH     : /api/deal/:id
// METHOD   : DELETE
// ACCESS   : Private Admin
// DESC     : Delete Deal
export const deleteDeal = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    await deleteImages(deal.images);
    await Deal.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDeal:", error.message);
    res.status(500).json({ error: "Failed to delete deal" });
  }
};
