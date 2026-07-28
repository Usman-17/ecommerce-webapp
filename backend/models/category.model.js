import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      default: null,
    },
  },
  { timestamps: true },
);

// Compound index for case-insensitive unique name per area
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export { Category };
