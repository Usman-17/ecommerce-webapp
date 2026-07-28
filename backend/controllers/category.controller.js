import { Category } from "../models/category.model.js";
import { Area } from "../models/area.model.js";

const formatCategory = (cat) => {
  return {
    _id: cat._id,
    name: cat.name,
    areaId: cat.area?._id || cat.area || null,
    areaName: cat.area?.name || null,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
  };
};

// PATH     : /api/category/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, area } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (area) {
      const areaExists = await Area.findById(area);
      if (!areaExists) {
        return res.status(400).json({ error: "Invalid Area ID" });
      }
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    const category = await new Category({ name, area }).save();
    const populated = await category.populate("area");
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

    if (area) {
      const areaExists = await Area.findById(area);
      if (!areaExists) {
        return res.status(400).json({ error: "Invalid Area ID" });
      }
      category.area = area;
    }

    if (name) category.name = name;

    await category.save();
    const populated = await category.populate("area");
    res.status(200).json(formatCategory(populated));
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
    res.status(200).json(formatCategory(category));
  } catch (error) {
    console.error("Error in getCategory:", error.message);
    res.status(500).json({ error: error.message });
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

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error.message);
    res.status(500).json({ error: error.message });
  }
};
