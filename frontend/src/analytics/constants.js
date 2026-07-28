export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
export const GTM_ID = import.meta.env.VITE_GTM_ID || "";
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";
export const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID || "";
export const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || "";
export const SNAPCHAT_PIXEL_ID = import.meta.env.VITE_SNAPCHAT_PIXEL_ID || "";
export const LINKEDIN_PARTNER_ID = import.meta.env.VITE_LINKEDIN_PARTNER_ID || "";

export const IS_ANALYTICS_ENABLED = import.meta.env.PROD && (GA_MEASUREMENT_ID || GTM_ID || CLARITY_ID);
export const IS_DEBUG_MODE = import.meta.env.DEV;

export const CURRENCY = "PKR";
export const SITE_NAME = "Jemzy";
export const SITE_URL = "https://jemzy.pk";

export const GA4_EVENTS = {
  PAGE_VIEW: "page_view",
  VIEW_ITEM: "view_item",
  VIEW_ITEM_LIST: "view_item_list",
  SELECT_ITEM: "select_item",
  SEARCH: "search",
  VIEW_CART: "view_cart",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  ADD_SHIPPING_INFO: "add_shipping_info",
  ADD_PAYMENT_INFO: "add_payment_info",
  PURCHASE: "purchase",
  REFUND: "refund",
  VIEW_PROMOTION: "view_promotion",
  SELECT_PROMOTION: "select_promotion",
  ADD_TO_WISHLIST: "add_to_wishlist",
  REMOVE_FROM_WISHLIST: "remove_from_wishlist",
  LOGIN: "login",
  LOGOUT: "logout",
  SIGN_UP: "sign_up",
  SHARE: "share",
  SCROLL: "scroll",
  TIMING: "timing",
  EXCEPTION: "exception",
  JS_ERROR: "js_error",
  API_ERROR: "api_error",
  CHECKOUT_ERROR: "checkout_error",
  PAYMENT_FAILURE: "payment_failure",
  FILE_DOWNLOAD: "file_download",
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  FORM_ERROR: "form_error",
  VIDEO_PLAY: "video_play",
  OUTBOUND_CLICK: "outbound_click",
  LCP: "largest_contentful_paint",
  CLS: "cumulative_layout_shift",
  INP: "interaction_to_next_paint",
  TTFB: "time_to_first_byte",
  FCP: "first_contentful_paint",
};

export const PAGE_NAMES = {
  HOME: "home",
  SHOP: "shop",
  PRODUCT: "product",
  CATEGORY: "category",
  CART: "cart",
  CHECKOUT: "checkout",
  WISHLIST: "wishlist",
  LOGIN: "login",
  SIGNUP: "signup",
  PROFILE: "profile",
  ORDERS: "orders",
  ORDER_DETAILS: "order_details",
  SEARCH: "search",
  NEW_ARRIVALS: "new_arrivals",
  BEST_SELLERS: "best_sellers",
  ABOUT: "about",
  CONTACT: "contact",
  FAQS: "faqs",
  HELP: "help",
  PRIVACY: "privacy_policy",
  TERMS: "terms",
  SHIPPING: "shipping_policy",
  TRACK_ORDER: "track_order",
  RECENTLY_VIEWED: "recently_viewed",
  REVIEWS: "reviews",
  NOT_FOUND: "404",
};

export const LIST_NAMES = {
  HOMEPAGE_FEATURED: "homepage_featured",
  HOMEPAGE_JEWELRY: "homepage_jewelry",
  HOMEPAGE_MAKEUP: "homepage_makeup",
  HOMEPAGE_HAIR_ACCESSORIES: "homepage_hair_accessories",
  HOMEPAGE_NEW_ARRIVALS: "homepage_new_arrivals",
  HOMEPAGE_BEST_SELLERS: "homepage_best_sellers",
  SHOP_GRID: "shop_grid",
  SEARCH_RESULTS: "search_results",
  WISHLIST: "wishlist",
  RECENTLY_VIEWED: "recently_viewed",
  RECOMMENDED: "recommended",
  CART: "cart",
};
