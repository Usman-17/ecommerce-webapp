import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trackingNo: {
      type: String,
      unique: true,
      sparse: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        variantName: { type: String },
        variantAttributes: { type: Map, of: String },
        productImages: [
          {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    address: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      default: "Order Placed",
    },

    paymentMethod: {
      type: String,
      require: true,
    },

    payment: {
      type: Boolean,
      require: true,
      default: false,
    },

    date: {
      type: Number,
      require: true,
    },

    cancelledAt: { type: Date },
    cancelRemarks: { type: String, default: "" },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
