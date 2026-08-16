import { Brand } from "../models/brand.model.js";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file, folder) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteImage = async (image) => {
  if (image && image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }
};

// PATH     : /api/brand/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Brand
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Brand Name is required" });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res
        .status(400)
        .json({ error: "Brand with this name already exists" });
    }

    let image = null;
    if (req.files && req.files.image) {
      image = await uploadImage(req.files.image, "BRAND_IMAGES");
    }

    const brand = await new Brand({ name, image }).save();
    return res.status(201).json(brand);
  } catch (error) {
    console.error("Error in createBrand controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/brand/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update Brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    if (name) brand.name = name;

    if (req.files && req.files.image) {
      await deleteImage(brand.image);
      brand.image = await uploadImage(req.files.image, "BRAND_IMAGES");
    }

    await brand.save();
    res.status(200).json(brand);
  } catch (error) {
    console.error("Error in updateBrand", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/brand/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all brands
export const getAllbrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    return res.status(200).json(brands);
  } catch (error) {
    console.log("Error in getAllbrands Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/brand/:id
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get Single Brand
export const getBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    res.status(200).json(brand);
  } catch (error) {
    console.log("Error in getBrand Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/brand/:id
// METHOD   : DELETE
// ACCESS   : PRIVATE
// DESC     : Delete Brand
export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    await deleteImage(brand.image);
    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBrand controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
