import { CURRENCY } from "./constants";

let transactionCounter = 0;

export const generateTransactionId = () => {
  transactionCounter += 1;
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}-${transactionCounter}`;
};

export const formatPrice = (price) => {
  const num = Number(price);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

export const getCurrency = () => CURRENCY;

export const safePush = (dataLayer, data) => {
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(data);
  }
};

export const getCartFromCookie = () => {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith("cart="));
    if (!raw) return [];
    const value = decodeURIComponent(raw.split("=")[1]);
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const getFromLocalStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const formatProductForAnalytics = (product, options = {}) => {
  const priceDetail = product?.productPriceDetailResponse || {};
  const salePrice =
    priceDetail.salePrice || product.salePrice || product.productSalePrice || 0;
  const netSalePrice = priceDetail.netSalePrice || product.netSalePrice || 0;
  const isSale = netSalePrice > 0 && netSalePrice < salePrice;
  const price = formatPrice(isSale ? netSalePrice : salePrice);
  const discount = isSale ? formatPrice(salePrice - netSalePrice) : 0;

  return {
    item_id: String(product.productId || product.productPackId || ""),
    item_name: product.productName || product.name || "",
    item_brand: product.productAreaName || "Jemzy",
    item_category: product.productCategoryName || product.category || "",
    item_category2: product.productSubCategoryName || product.subCategory || "",
    item_variant: options.variant || "",
    price,
    quantity: options.quantity || 1,
    coupon: options.coupon || "",
    discount,
    affiliation: options.affiliation || "Jemzy Online Store",
    item_list_name: options.item_list_name || "",
    item_list_id: options.item_list_id || "",
    index: options.index ?? 0,
    currency: CURRENCY,
  };
};

export const formatCartItemForAnalytics = (item, options = {}) => {
  const price = formatPrice(item.price || 0);
  const variantParts = (item.selectedVariants || [])
    .map((v) => v.detailName)
    .filter(Boolean);

  return {
    item_id: String(item.productId || ""),
    item_name: item.name || "",
    item_brand: "Jemzy",
    item_category: item.category || "",
    item_category2: item.subCategory || "",
    item_variant: variantParts.join(", "),
    price,
    quantity: item.quantity || 1,
    coupon: options.coupon || "",
    discount: 0,
    affiliation: "Jemzy Online Store",
    item_list_name: options.item_list_name || "cart",
    item_list_id: options.item_list_id || "",
    index: options.index ?? 0,
    currency: CURRENCY,
  };
};

export const formatOrderItemForAnalytics = (item, options = {}) => {
  const price = formatPrice(item.orderPrice || 0);
  return {
    item_id: String(item.productPackId || ""),
    item_name: options.productName || "",
    item_brand: "Jemzy",
    item_category: options.category || "",
    item_category2: options.subCategory || "",
    item_variant: options.variant || "",
    price,
    quantity: item.orderQuantity || 1,
    coupon: options.coupon || "",
    discount: 0,
    affiliation: "Jemzy Online Store",
    item_list_name: options.item_list_name || "",
    index: options.index ?? 0,
    currency: CURRENCY,
  };
};

export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export const throttle = (fn, ms = 300) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
};
