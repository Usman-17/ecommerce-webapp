import mongoose from "mongoose";

var brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Name is required."],
      unique: true,
      trim: true,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true },
);

export const Brand = mongoose.model("Brand", brandSchema);
