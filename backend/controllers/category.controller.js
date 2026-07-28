import { Category } from "../models/category.model.js";
import { Area } from "../models/area.model.js";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "CATEGORY_IMAGES",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteImage = async (image) => {
  if (image && image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }
};

const formatCategory = (cat) => ({
  _id: cat._id,
  name: cat.name,
  areaId: cat.area?._id || cat.area || null,
  areaName: cat.area?.name || null,
  imagePublicId: cat.image?.public_id || null,
  imageUrl: cat.image?.url || null,
  createdAt: cat.createdAt,
  updatedAt: cat.updatedAt,
});

// PATH     : /api/category/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, area } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (area) {
      const areaExists = await Area.findById(area);
      if (!areaExists) {
        return res.status(400).json({ error: "Invalid Area ID" });
      }
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    let image = null;
    if (req.files && req.files.image) {
      image = await uploadImage(req.files.image);
    }

    const category = await Category.create({
      name: name.trim(),
      area: area || null,
      image,
    });

    const populated = await Category.findById(category._id).populate("area");
    return res.status(201).json(formatCategory(populated));
  } catch (error) {
    console.error("Error in createCategory controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/category/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, area } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (area !== undefined) {
      if (area === "" || area === "null" || area === "undefined") {
        category.area = null;
      } else if (area) {
        const areaExists = await Area.findById(area);
        if (!areaExists) {
          return res.status(400).json({ error: "Invalid Area ID" });
        }
        category.area = area;
      }
    }

    if (name && name.trim()) {
      const existing = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Category with this name already exists" });
      }
      category.name = name.trim();
    }

    // Handle image upload
    if (req.files && req.files.image) {
      await deleteImage(category.image);
      category.image = await uploadImage(req.files.image);
    }

    await category.save();
    const populated = await Category.findById(category._id).populate("area");
    return res.status(200).json(formatCategory(populated));
  } catch (error) {
    console.error("Error in updateCategory:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/category/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("area")
      .sort({ createdAt: -1 });

    const formatted = categories.map(formatCategory);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getAllCategories:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/category/:id
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get single category
export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("area");
    if (!category) return res.status(404).json({ error: "Category not found" });
    return res.status(200).json(formatCategory(category));
  } catch (error) {
    console.error("Error in getCategory:", error.message);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
};

// PATH     : /api/category/:id
// METHOD   : DELETE
// ACCESS   : Private Admin
// DESC     : Delete Category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await deleteImage(category.image);
    await Category.findByIdAndDelete(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error.message);
    return res.status(500).json({ error: "Failed to delete category" });
  }
};
