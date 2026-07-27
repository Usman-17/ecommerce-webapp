import mongoose from "mongoose";

var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is required."],
      unique: true,
      trim: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
