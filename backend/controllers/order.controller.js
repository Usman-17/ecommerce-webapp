import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Deal from "../models/deal.model.js";

const generateTrackingNo = () => {
  const prefix = "JMZ";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// PATH     : /api/order/place
// METHOD   : POST
// ACCESS   : Public
// DESC     : Placing order using COD Method
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const { cart, totalAmount, deliveryInfo, scoop, deal, shippingCharge } =
      req.body;

    if (!cart || Object.keys(cart).length === 0) {
      return res
        .status(400)
        .json({ error: "Cart is empty or items are invalid." });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }

    if (
      !deliveryInfo.firstName ||
      !deliveryInfo.lastName ||
      !deliveryInfo.email ||
      !deliveryInfo.address ||
      !deliveryInfo.city ||
      !deliveryInfo.phone
    ) {
      return res.status(400).json({ error: "Incomplete address information." });
    }

    const items = [];

    // Skip cart item parsing for scoop/deal orders
    if (!scoop && !deal) {
      for (const productId in cart) {
        const variantQuantities = cart[productId];

        if (typeof variantQuantities === "number") {
          items.push({
            productId,
            quantity: variantQuantities,
            variantId: null,
          });
        } else if (typeof variantQuantities === "object") {
          for (const variantId in variantQuantities) {
            const quantity = variantQuantities[variantId];

            items.push({
              productId,
              quantity,
              variantId: variantId || null,
            });
          }
        }
      }
    }

    // Fetch product details (skip for scoop/deal orders)
    let orderItems = [];
    if (!scoop && !deal) {
      orderItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.productId);

          if (!product) {
            throw new Error(`Product not found with ID: ${item.productId}`);
          }

          let itemPrice = product.price;
          let itemImages = product.productImages;
          let variantName = null;
          let variantAttributes = null;

          if (item.variantId) {
            const variant = product.variants.id(item.variantId);
            if (!variant) {
              throw new Error(`Variant not found with ID: ${item.variantId}`);
            }

            itemPrice = variant.price || product.price;
            itemImages = variant.image
              ? [variant.image]
              : product.productImages;
            variantName = variant.name;
            variantAttributes = variant.attributes;
          }

          return {
            productId: item.productId,
            title: product.title,
            price: itemPrice,
            purchasePrice: product.purchasePrice || 0,
            quantity: item.quantity,
            variantId: item.variantId,
            variantName,
            variantAttributes,
            productImages: itemImages,
          };
        }),
      );
    }

    // For deal orders, populate items from the deal's products with selected variants
    if (deal) {
      if (deal.products?.length > 0) {
        // Use products with selected variants sent from frontend, fetch purchasePrice
        orderItems = await Promise.all(
          deal.products.map(async (p) => {
            const dbProduct = await Product.findById(
              p.productId || p._id,
            ).select("price purchasePrice");
            return {
              productId: p.productId || p._id,
              title: p.title,
              price: dbProduct?.price || 0,
              purchasePrice: dbProduct?.purchasePrice || 0,
              quantity: 1,
              variantId: p.selectedVariant?._id || null,
              variantName: p.selectedVariant?.name || null,
              variantAttributes: p.selectedVariant?.attributes || null,
              productImages: p.selectedVariant?.image?.url
                ? [p.selectedVariant.image]
                : p.productImages,
            };
          }),
        );
      } else {
        // Fallback: fetch products from deal document
        const dealDoc = await Deal.findById(deal.dealId).populate("products");
        if (dealDoc?.products) {
          orderItems = dealDoc.products.map((product) => ({
            productId: product._id,
            title: product.title,
            price: 0,
            purchasePrice: product.purchasePrice || 0,
            quantity: 1,
            variantId: null,
            variantName: null,
            variantAttributes: null,
            productImages: product.productImages,
          }));
        }
      }
    }

    // For scoop orders, populate items from the scoop's products
    if (scoop) {
      if (scoop.products?.length > 0) {
        orderItems = await Promise.all(
          scoop.products.map(async (p) => {
            const dbProduct = await Product.findById(
              p.productId || p._id,
            ).select("price purchasePrice");
            return {
              productId: p.productId || p._id,
              title: p.title,
              price: dbProduct?.price || 0,
              purchasePrice: dbProduct?.purchasePrice || 0,
              quantity: 1,
              variantId: p.selectedVariant?._id || null,
              variantName: p.selectedVariant?.name || null,
              variantAttributes: p.selectedVariant?.attributes || null,
              productImages: p.selectedVariant?.image?.url
                ? [p.selectedVariant.image]
                : p.productImages,
            };
          }),
        );
      }
    }

    // Save order — compute amount as items-only total for all order types
    const isNormalOrder = !scoop && !deal;
    const computedAmount = isNormalOrder
      ? orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : Number(totalAmount) - (Number(shippingCharge) || 0);
    const orderData = {
      userId,
      trackingNo: generateTrackingNo(),
      items: orderItems,
      amount: computedAmount,
      shippingCharge: Number(shippingCharge) || 0,
      address: {
        firstName: deliveryInfo.firstName,
        lastName: deliveryInfo.lastName,
        email: deliveryInfo.email,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        phone: deliveryInfo.phone,
      },
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      orderType: scoop ? "scoop" : deal ? "deal" : "normal",
    };

    if (scoop) {
      orderData.scoopDetails = {
        scoopType: scoop.type,
        quantity: scoop.quantity,
        fixedPrice: scoop.fixedPrice,
        selections: scoop.selections
          ? new Map(Object.entries(scoop.selections))
          : undefined,
      };
    }

    if (deal) {
      orderData.dealDetails = {
        dealId: deal.dealId,
        dealType: deal.dealType,
        fixedPrice: deal.fixedPrice,
      };
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Clear cart (only for logged-in users)
    if (userId) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.json({
      success: true,
      message: "Order Placed",
      id: newOrder._id,
      trackingNo: newOrder.trackingNo,
    });
  } catch (error) {
    console.log("Error in placeOrder Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/order/get
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : get user orders
export const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/order/all
// METHOD   : GET
// ACCESS   : Private
// DESC     : get All orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // Enrich items with purchasePrice from Product collection
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        let totalPurchasePrice = 0;

        orderObj.items = await Promise.all(
          orderObj.items.map(async (item) => {
            const product = await Product.findById(item.productId).select(
              "price purchasePrice",
            );
            if (product) {
              if (!item.price || item.price === 0) {
                item.price = product.price || 0;
              }
              if (!item.purchasePrice || item.purchasePrice === 0) {
                item.purchasePrice = product.purchasePrice || 0;
              }
            }
            totalPurchasePrice += (item.purchasePrice || 0) * item.quantity;
            return item;
          }),
        );

        orderObj.totalPurchasePrice = totalPurchasePrice;
        orderObj.profit = orderObj.amount - totalPurchasePrice;
        return orderObj;
      }),
    );

    return res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("Error in allOrders Controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/order/update
// METHOD   : POST
// ACCESS   : Public & Private
// DESC     : update user order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, extraExpense } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (status) {
      if (status === "Cancelled" && !order.cancelledAt) {
        order.cancelledAt = new Date();
      }
      if (status === "Delivered" && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
      order.status = status;
    }

    if (extraExpense !== undefined) {
      order.extraExpense = Number(extraExpense) || 0;
    }

    await order.save();

    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/order/track
// METHOD   : GET
// ACCESS   : Public
// DESC     : Track order by tracking number
export const trackOrder = async (req, res) => {
  const { trackingNo } = req.query;
  try {
    if (!trackingNo) {
      return res.status(400).json({ error: "Tracking number is required" });
    }

    const order = await Order.findOne({ trackingNo })
      .select("-userId -__v")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "No record found." });
    }

    return res.status(200).json({ data: order });
  } catch (error) {
    console.log("Error in trackOrder controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/order/cancel
// METHOD   : POST
// ACCESS   : Public
// DESC     : Cancel order by tracking number with remarks
export const cancelWebOrder = async (req, res) => {
  const { id, remarks } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelRemarks = remarks || "";
    await order.save();

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log("Error in cancelWebOrder controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
