import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
    },
    price: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    purchasePrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    secondaryPrice: {
      type: Number,
      min: 0,
    },

    sold: {
      type: String,
      default: "0",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    tags: {
      type: [String],
      required: true,
    },

    webLinks: {
      type: [String],
      default: [],
    },

    productImages: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    variants: [variantSchema],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
