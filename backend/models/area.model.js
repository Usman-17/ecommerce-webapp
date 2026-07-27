import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Area Name is required."],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Area = mongoose.model("Area", areaSchema);
