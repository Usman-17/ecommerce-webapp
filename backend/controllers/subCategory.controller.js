import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";

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
      return res.status(400).json({
        error: "SubCategory with this name already exists in this category",
      });
    }

    const subCategory = await new SubCategory({ name, category }).save();
    const populated = await subCategory.populate("category");
    return res.status(201).json(populated);
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
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid Category ID" });
      }
      subCategory.category = category;
    }

    if (name) subCategory.name = name;

    await subCategory.save();
    const populated = await subCategory.populate("category");
    res.status(200).json(populated);
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
      .populate("category")
      .sort({ createdAt: -1 });
    return res.status(200).json(subCategories);
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
    const subCategory = await SubCategory.findById(id).populate("category");
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error in getSubCategory:", error.message);
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
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });

    await SubCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSubCategory:", error.message);
    res.status(500).json({ error: error.message });
  }
};
