import { SubCategory } from "../models/subCategory.model.js";
import { Category } from "../models/category.model.js";

const formatSubCategory = (sub) => {
  return {
    _id: sub._id,
    name: sub.name,
    categoryId: sub.category?._id || sub.category,
    categoryName: sub.category?.name || null,
    areaId: sub.category?.area?._id || sub.category?.area || null,
    areaName: sub.category?.area?.name || null,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
  };
};

// PATH     : /api/subcategory/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create SubCategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "Name and Category are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid Category ID" });
    }

    const existing = await SubCategory.findOne({ name, category });
    if (existing) {
      return res
        .status(400)
        .json({ error: "SubCategory with this name already exists in this category" });
    }

    const subCategory = await new SubCategory({ name, category }).save();
    const populated = await subCategory.populate({ path: "category", populate: { path: "area" } });
    return res.status(201).json(formatSubCategory(populated));
  } catch (error) {
    console.error("Error in createSubCategory:", error.message);
    res.status(500).json({ error: error.message });
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
    if (!subCategory) return res.status(404).json({ error: "SubCategory not found" });

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid Category ID" });
      }
      subCategory.category = category;
    }

    if (name) subCategory.name = name;

    await subCategory.save();
    const populated = await subCategory.populate({ path: "category", populate: { path: "area" } });
    res.status(200).json(formatSubCategory(populated));
  } catch (error) {
    console.error("Error in updateSubCategory:", error.message);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/subcategory/:id
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get single subcategory
export const getSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findById(id).populate({ path: "category", populate: { path: "area" } });
    if (!subCategory) return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json(formatSubCategory(subCategory));
  } catch (error) {
    console.error("Error in getSubCategory:", error.message);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    if (!subCategory) return res.status(404).json({ error: "SubCategory not found" });

    await SubCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSubCategory:", error.message);
    res.status(500).json({ error: error.message });
  }
};
