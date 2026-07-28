import { useMemo } from "react";
import {
  trackViewItem as _trackViewItem,
  trackViewItemList as _trackViewItemList,
  trackSelectItem as _trackSelectItem,
  trackAddToCart as _trackAddToCart,
  trackRemoveFromCart as _trackRemoveFromCart,
  trackViewCart as _trackViewCart,
  trackBeginCheckout as _trackBeginCheckout,
  trackAddShippingInfo as _trackAddShippingInfo,
  trackAddPaymentInfo as _trackAddPaymentInfo,
  trackPurchase as _trackPurchase,
  trackRefund as _trackRefund,
  trackAddToWishlist as _trackAddToWishlist,
  trackRemoveFromWishlist as _trackRemoveFromWishlist,
} from "../analytics/ecommerce";
import { IS_ANALYTICS_ENABLED } from "../analytics/constants";

const useEcommerce = () => {
  return useMemo(() => {
    const guard =
      (fn) =>
      (...args) => {
        if (!IS_ANALYTICS_ENABLED) return;
        return fn(...args);
      };

    return {
      trackViewItem: guard(_trackViewItem),
      trackViewItemList: guard(_trackViewItemList),
      trackSelectItem: guard(_trackSelectItem),
      trackAddToCart: guard(_trackAddToCart),
      trackRemoveFromCart: guard(_trackRemoveFromCart),
      trackViewCart: guard(_trackViewCart),
      trackBeginCheckout: guard(_trackBeginCheckout),
      trackAddShippingInfo: guard(_trackAddShippingInfo),
      trackAddPaymentInfo: guard(_trackAddPaymentInfo),
      trackPurchase: guard(_trackPurchase),
      trackRefund: guard(_trackRefund),
      trackAddToWishlist: guard(_trackAddToWishlist),
      trackRemoveFromWishlist: guard(_trackRemoveFromWishlist),
    };
  }, []);
};

export default useEcommerce;
