import Product from "../models/product.model.js";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/category.model.js";

import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";

const uploadImages = async (files, folder) => {
  const uploaded = [];
  const images = Array.isArray(files) ? files : [files];
  for (const image of images) {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder,
    });
    uploaded.push({ url: result.secure_url, public_id: result.public_id });
  }
  return uploaded;
};

const uploadSingleImage = async (file, folder) => {
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

// PATH     : /api/product/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      brand,
      tags,
      sold,
      secondaryPrice,
      variants: variantsJson,
    } = req.body;

    if (!title || !description || !price || !category || !brand || !tags) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ error: "Invalid brand ID" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const slug = slugify(title, { lower: true });
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this title already exists" });
    }

    if (!req.files || !req.files.productImages) {
      return res
        .status(400)
        .json({ error: "At least one product image is required" });
    }

    const uploadedProductImages = await uploadImages(
      req.files.productImages,
      "PRODUCT_IMAGES",
    );

    let parsedVariants = [];
    if (variantsJson) {
      try {
        parsedVariants = JSON.parse(variantsJson);
      } catch {
        return res.status(400).json({ error: "Invalid variants JSON format" });
      }
    }

    for (let i = 0; i < parsedVariants.length; i++) {
      const variant = parsedVariants[i];
      const imageKey = `variant_${i}_image`;

      if (req.files && req.files[imageKey]) {
        variant.image = await uploadSingleImage(
          req.files[imageKey],
          "VARIANT_IMAGES",
        );
      } else {
        variant.image = null;
      }
    }

    const newProduct = new Product({
      title,
      slug,
      description,
      price,
      secondaryPrice,
      category,
      brand,
      sold,
      tags,
      productImages: uploadedProductImages,
      variants: parsedVariants,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      secondaryPrice,
      category,
      brand,
      quantity,
      tags,
      sold,
      variants: variantsJson,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let foundCategory = null;
    if (category) {
      foundCategory = await Category.findById(category).catch(() => null);
      if (!foundCategory) {
        foundCategory = await Category.findOne({ name: category.trim() });
      }
      if (!foundCategory) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    let foundBrand = null;
    if (brand) {
      foundBrand = await Brand.findById(brand).catch(() => null);
      if (!foundBrand) {
        foundBrand = await Brand.findOne({ name: brand.trim() });
      }
      if (!foundBrand) {
        return res.status(400).json({ error: "Invalid brand" });
      }
    }

    if (title) {
      const newSlug = slugify(title, { lower: true });
      const existingProduct = await Product.findOne({ slug: newSlug });
      if (existingProduct && existingProduct._id.toString() !== id) {
        return res
          .status(400)
          .json({ error: "Product with this title already exists" });
      }
      product.title = title;
      product.slug = newSlug;
    }

    if (description) product.description = description;
    if (tags) product.tags = tags;
    if (price) product.price = price;
    if (secondaryPrice) product.secondaryPrice = secondaryPrice;
    if (quantity) product.quantity = quantity;
    if (sold) product.sold = sold;
    if (foundCategory) product.category = foundCategory._id;
    if (foundBrand) product.brand = foundBrand._id;

    if (req.files && req.files.productImages) {
      await deleteImages(product.productImages);
      product.productImages = await uploadImages(
        req.files.productImages,
        "PRODUCT_IMAGES",
      );
    }

    if (variantsJson) {
      let parsedVariants;
      try {
        parsedVariants = JSON.parse(variantsJson);
      } catch {
        return res.status(400).json({ error: "Invalid variants JSON format" });
      }

      for (let i = 0; i < parsedVariants.length; i++) {
        const variant = parsedVariants[i];
        const imageKey = `variant_${i}_image`;

        if (variant._id) {
          const existingVariant = product.variants.id(variant._id);
          if (existingVariant) {
            if (req.files && req.files[imageKey]) {
              await deleteImage(existingVariant.image);
              variant.image = await uploadSingleImage(
                req.files[imageKey],
                "VARIANT_IMAGES",
              );
            } else {
              variant.image = existingVariant.image;
            }
          }
        } else {
          if (req.files && req.files[imageKey]) {
            variant.image = await uploadSingleImage(
              req.files[imageKey],
              "VARIANT_IMAGES",
            );
          } else {
            variant.image = null;
          }
        }
      }

      const incomingIds = parsedVariants
        .filter((v) => v._id)
        .map((v) => v._id.toString());

      for (const oldVariant of product.variants) {
        if (!incomingIds.includes(oldVariant._id.toString())) {
          await deleteImage(oldVariant.image);
        }
      }

      product.variants = parsedVariants;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log("Update Product Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// PATH     : /api/product/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all products
export const getAllproducts = async (req, res) => {
  try {
    const product = await Product.find()
      .populate("brand")
      .populate("category")
      .sort({ createdAt: -1 });

    if (!product.length === 0) return res.status(200).json([]);

    return res.status(200).json(product);
  } catch (error) {
    console.log("Error in getAllProduct Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product/:id
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get Single Product
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("brand")
      .populate("category");
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProduct Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product/slug/:slug
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get Single Product By Slug
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug })
      .populate("brand")
      .populate("category");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProductBySlug Controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/product/:id
// METHOD   : DELETE
// ACCESS   : PRIVATE
// DESC     : Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.productImages && product.productImages.length > 0) {
      await deleteImages(product.productImages);
    }

    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        await deleteImage(variant.image);
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
