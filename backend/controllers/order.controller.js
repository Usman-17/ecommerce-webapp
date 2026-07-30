import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

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
    const { cart, totalAmount, deliveryInfo, scoop, deal } = req.body;

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

    // Fetch product details
    const orderItems = await Promise.all(
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
          itemImages = variant.image ? [variant.image] : product.productImages;
          variantName = variant.name;
          variantAttributes = variant.attributes;
        }

        return {
          productId: item.productId,
          title: product.title,
          price: itemPrice,
          quantity: item.quantity,
          variantId: item.variantId,
          variantName,
          variantAttributes,
          productImages: itemImages,
        };
      }),
    );

    // Save order
    const orderData = {
      userId,
      trackingNo: generateTrackingNo(),
      items: orderItems,
      amount: totalAmount,
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

    // Find all orders associated with the user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

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
    return res.status(200).json(orders);
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
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Set timestamps if the status is Cancelled or Delivered
    if (status === "Cancelled" && !order.cancelledAt) {
      order.cancelledAt = new Date();
    }

    if (status === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated" });
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
