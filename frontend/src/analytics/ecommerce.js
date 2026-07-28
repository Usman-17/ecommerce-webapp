import { trackEcommerce } from "./analytics";
import { GA4_EVENTS, CURRENCY } from "./constants";
import {
  formatPrice,
  formatProductForAnalytics,
  formatCartItemForAnalytics,
  generateTransactionId,
} from "./helpers";

export const trackViewItem = (product) => {
  const item = formatProductForAnalytics(product);
  trackEcommerce(GA4_EVENTS.VIEW_ITEM, {
    items: [item],
    value: item.price,
  });
};

export const trackViewItemList = (items, listName, listId = "") => {
  const formattedItems = items.map((item, index) =>
    formatProductForAnalytics(item, {
      item_list_name: listName,
      item_list_id: listId,
      index,
    })
  );

  trackEcommerce(GA4_EVENTS.VIEW_ITEM_LIST, {
    item_list_name: listName,
    item_list_id: listId,
    items: formattedItems,
  });
};

export const trackSelectItem = (product, listName = "", listId = "", index = 0) => {
  const item = formatProductForAnalytics(product, {
    item_list_name: listName,
    item_list_id: listId,
    index,
  });

  trackEcommerce(GA4_EVENTS.SELECT_ITEM, {
    items: [item],
    item_list_name: listName,
    item_list_id: listId,
  });
};

export const trackAddToCart = (product, quantity = 1, options = {}) => {
  const item = formatProductForAnalytics(product, {
    quantity,
    ...options,
  });

  trackEcommerce(GA4_EVENTS.ADD_TO_CART, {
    items: [item],
    value: item.price * quantity,
  });
};

export const trackRemoveFromCart = (product, quantity = 1, options = {}) => {
  const item = formatCartItemForAnalytics(product, {
    quantity,
    ...options,
  });

  trackEcommerce(GA4_EVENTS.REMOVE_FROM_CART, {
    items: [item],
    value: item.price * quantity,
  });
};

export const trackViewCart = (cartItems, totalValue = 0) => {
  const items = cartItems.map((item, index) =>
    formatCartItemForAnalytics(item, {
      item_list_name: "cart",
      index,
    })
  );

  const value = totalValue || items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  trackEcommerce(GA4_EVENTS.VIEW_CART, {
    items,
    value: formatPrice(value),
  });
};

export const trackBeginCheckout = (items, totalValue, options = {}) => {
  const formattedItems = items.map((item, index) =>
    formatCartItemForAnalytics(item, {
      coupon: options.coupon,
      item_list_name: "checkout",
      index,
    })
  );

  trackEcommerce(GA4_EVENTS.BEGIN_CHECKOUT, {
    items: formattedItems,
    value: formatPrice(totalValue),
    coupon: options.coupon || "",
    number_of_items: items.length,
  });
};

export const trackAddShippingInfo = (items, totalValue, options = {}) => {
  const formattedItems = items.map((item, index) =>
    formatCartItemForAnalytics(item, {
      coupon: options.coupon,
      item_list_name: "checkout",
      index,
    })
  );

  trackEcommerce(GA4_EVENTS.ADD_SHIPPING_INFO, {
    items: formattedItems,
    value: formatPrice(totalValue),
    coupon: options.coupon || "",
    shipping_tier: options.shipping_tier || "Standard",
    shipping_cost: options.shipping_cost || 0,
  });
};

export const trackAddPaymentInfo = (items, totalValue, options = {}) => {
  const formattedItems = items.map((item, index) =>
    formatCartItemForAnalytics(item, {
      coupon: options.coupon,
      item_list_name: "checkout",
      index,
    })
  );

  trackEcommerce(GA4_EVENTS.ADD_PAYMENT_INFO, {
    items: formattedItems,
    value: formatPrice(totalValue),
    coupon: options.coupon || "",
    payment_type: options.payment_type || "COD",
  });
};

export const trackPurchase = (orderData) => {
  const {
    transactionId,
    items = [],
    subtotal = 0,
    shippingFee = 0,
    discount = 0,
    tax = 0,
    coupon = "",
    total = 0,
  } = orderData;

  const finalTransactionId = transactionId || generateTransactionId();
  const value = formatPrice(total || subtotal + shippingFee - discount);

  const formattedItems = items.map((item, index) => ({
    item_id: String(item.productPackId || item.productId || ""),
    item_name: item.name || item.productName || "",
    item_brand: "Jemzy",
    item_category: item.category || "",
    item_category2: item.subCategory || "",
    item_variant: item.variant || "",
    price: formatPrice(item.orderPrice || item.price || 0),
    quantity: item.orderQuantity || item.quantity || 1,
    coupon,
    discount: 0,
    affiliation: "Jemzy Online Store",
    currency: CURRENCY,
    index,
  }));

  trackEcommerce(GA4_EVENTS.PURCHASE, {
    transaction_id: finalTransactionId,
    value,
    tax: formatPrice(tax),
    shipping: formatPrice(shippingFee),
    discount: formatPrice(discount),
    coupon,
    items: formattedItems,
  });
};

export const trackRefund = (transactionId, value = 0) => {
  trackEcommerce(GA4_EVENTS.REFUND, {
    transaction_id: transactionId,
    value: formatPrice(value),
  });
};

export const trackAddToWishlist = (product) => {
  const item = formatProductForAnalytics(product);
  trackEcommerce(GA4_EVENTS.ADD_TO_WISHLIST, {
    items: [item],
    value: item.price,
  });
};

export const trackRemoveFromWishlist = (product) => {
  const item = formatProductForAnalytics(product);
  trackEcommerce(GA4_EVENTS.REMOVE_FROM_WISHLIST, {
    items: [item],
    value: item.price,
  });
};
