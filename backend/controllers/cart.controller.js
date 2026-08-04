import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// PATH     : /api/cart/add
// METHOD   : POST
// ACCESS   : Public
// DESC     : Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, variantId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }

    const userData = await User.findById(userId);
    if (!userData) return res.status(404).json({ error: "User not found" });

    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cartData = userData.cartData || {};

    if (product.variants && product.variants.length > 0) {
      if (!variantId) {
        return res
          .status(400)
          .json({ error: "variantId is required for this product" });
      }

      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(400).json({ error: "Invalid variant ID" });
      }

      if (variant.isActive === false) {
        return res
          .status(400)
          .json({ error: "This variant is no longer available" });
      }

      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }

      cartData[itemId][variantId] =
        (cartData[itemId][variantId] || 0) + quantity;
    } else {
      if (product.sold < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      cartData[itemId] = (cartData[itemId] || 0) + quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, data: cartData });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/cart/update
// METHOD   : PUT
// ACCESS   : Private
// DESC     : Update Cart
export const updateCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const { itemId, variantId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({ error: "Missing itemId or quantity" });
    }

    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let updateQuery = {};

    if (product.variants && product.variants.length > 0) {
      if (!variantId) {
        return res
          .status(400)
          .json({ error: "variantId is required for this product" });
      }

      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(400).json({ error: "Invalid variant ID" });
      }

      if (variant.isActive === false) {
        return res
          .status(400)
          .json({ error: "This variant is no longer available" });
      }

      if (quantity === 0) {
        updateQuery = {
          $unset: {
            [`cartData.${itemId}.${variantId}`]: 1,
          },
        };
      } else {
        updateQuery = {
          $set: {
            [`cartData.${itemId}.${variantId}`]: quantity,
          },
        };
      }
    } else {
      if (quantity === 0) {
        updateQuery = {
          $unset: {
            [`cartData.${itemId}`]: 1,
          },
        };
      } else {
        updateQuery = {
          $set: {
            [`cartData.${itemId}`]: quantity,
          },
        };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: updatedUser.cartData });
  } catch (error) {
    console.error("Error in updateCart:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATH     : /api/cart/get
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get User Cart
export const getUserCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error in getUserCart controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/cart/delete
// METHOD   : DELETE
// ACCESS   : Private
// DESC     : Delete a cart item
export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, variantId } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "Missing itemId" });
    }

    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartData = userData.cartData || {};

    if (product.variants && product.variants.length > 0) {
      if (!variantId) {
        return res
          .status(400)
          .json({ error: "variantId is required for this product" });
      }

      if (!cartData[itemId] || !cartData[itemId][variantId]) {
        return res
          .status(404)
          .json({ error: "Item/variant not found in cart" });
      }

      delete cartData[itemId][variantId];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      delete cartData[itemId];
    }

    await User.findByIdAndUpdate(userId, { $set: { cartData } });

    res.json({ success: true, message: "Item deleted successfully", cartData });
  } catch (error) {
    console.error("Error in deleteCartItem:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
