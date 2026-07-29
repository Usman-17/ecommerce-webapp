import { SubCategory } from "../models/subCategory.model.js";
import { Category } from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "SUBCATEGORY_IMAGES",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteImage = async (image) => {
  if (image && image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }
};

const formatSubCategory = (sub) => ({
  _id: sub._id,
  name: sub.name,
  categoryId: sub.category?._id || sub.category || null,
  categoryName: sub.category?.name || null,
  areaId: sub.category?.area?._id || sub.category?.area || null,
  areaName: sub.category?.area?.name || null,
  imagePublicId: sub.image?.public_id || null,
  imageUrl: sub.image?.url || null,
  createdAt: sub.createdAt,
  updatedAt: sub.updatedAt,
});

// PATH     : /api/subcategory/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create SubCategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid Category ID" });
    }

    const existing = await SubCategory.findOne({ name: name.trim(), category });
    if (existing) {
      return res
        .status(400)
        .json({
          error: "SubCategory with this name already exists in this category",
        });
    }

    let image = null;
    if (req.files && req.files.image) {
      image = await uploadImage(req.files.image);
    }

    const subCategory = await SubCategory.create({
      name: name.trim(),
      category,
      image,
    });

    const populated = await SubCategory.findById(subCategory._id).populate({
      path: "category",
      populate: { path: "area" },
    });
    return res.status(201).json(formatSubCategory(populated));
  } catch (error) {
    console.error("Error in createSubCategory:", error.message);
    return res.status(500).json({ error: "Failed to create subcategory" });
  }
};

// PATH     : /api/subcategory/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update SubCategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid Category ID" });
      }
      subCategory.category = category;
    }

    if (name && name.trim()) {
      subCategory.name = name.trim();
    }

    // Handle image upload
    if (req.files && req.files.image) {
      await deleteImage(subCategory.image);
      subCategory.image = await uploadImage(req.files.image);
    }

    await subCategory.save();
    const populated = await SubCategory.findById(subCategory._id).populate({
      path: "category",
      populate: { path: "area" },
    });
    return res.status(200).json(formatSubCategory(populated));
  } catch (error) {
    console.error("Error in updateSubCategory:", error.message);
    return res.status(500).json({ error: "Failed to update subcategory" });
  }
};

// PATH     : /api/subcategory/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all subcategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate({ path: "category", populate: { path: "area" } })
      .sort({ createdAt: -1 });

    const formatted = subCategories.map(formatSubCategory);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getAllSubCategories:", error.message);
    return res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// PATH     : /api/subcategory/:id
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get single subcategory
export const getSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findById(id).populate({
      path: "category",
      populate: { path: "area" },
    });
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    return res.status(200).json(formatSubCategory(subCategory));
  } catch (error) {
    console.error("Error in getSubCategory:", error.message);
    return res.status(500).json({ error: "Failed to fetch subcategory" });
  }
};

// PATH     : /api/subcategory/category/:categoryId
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get subcategories by category
export const getSubCategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const subCategories = await SubCategory.find({ category: categoryId })
      .populate({ path: "category", populate: { path: "area" } })
      .sort({ createdAt: -1 });

    const formatted = subCategories.map(formatSubCategory);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getSubCategoriesByCategory:", error.message);
    return res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// PATH     : /api/subcategory/:id
// METHOD   : DELETE
// ACCESS   : Private Admin
// DESC     : Delete SubCategory
export const deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findById(id);
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });

    await deleteImage(subCategory.image);
    await SubCategory.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSubCategory:", error.message);
    return res.status(500).json({ error: "Failed to delete subcategory" });
  }
};
