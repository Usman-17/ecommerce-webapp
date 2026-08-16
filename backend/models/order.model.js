import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
        purchasePrice: { type: Number, default: 0 },
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

    shippingCharge: {
      type: Number,
      default: 0,
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
    extraExpense: { type: Number, default: 0 },

    orderType: {
      type: String,
      enum: ["normal", "scoop", "deal"],
      default: "normal",
    },

    scoopDetails: {
      scoopType: { type: String },
      quantity: { type: Number },
      fixedPrice: { type: Number },
      selections: { type: Map, of: String },
    },

    dealDetails: {
      dealId: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },
      dealType: { type: String },
      fixedPrice: { type: Number },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
