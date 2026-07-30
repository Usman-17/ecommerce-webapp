import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    dealPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
