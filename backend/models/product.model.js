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

    secondaryPrice: {
      type: Number,
      min: 0,
    },

    sold: {
      type: String,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    tags: {
      type: [String],
      required: true,
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
