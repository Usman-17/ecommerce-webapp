import { useCallback } from "react";
import {
  trackEvent,
  trackEcommerce,
  trackPageView,
  setUserProperties,
  trackException,
} from "../analytics/analytics";
import {
  trackLogin as _trackLogin,
  trackLogout as _trackLogout,
  trackSignUp as _trackSignUp,
  trackSearch as _trackSearch,
  trackShare as _trackShare,
  trackFormStart as _trackFormStart,
  trackFormSubmit as _trackFormSubmit,
  trackFormError as _trackFormError,
} from "../analytics/events";
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
import {
  track404 as _track404,
  trackApiError as _trackApiError,
  trackPaymentFailure as _trackPaymentFailure,
  trackCheckoutError as _trackCheckoutError,
} from "../analytics/errors";

export const useAnalytics = () => {
  const track = useCallback((name, params) => trackEvent(name, params), []);

  const trackEcom = useCallback((name, data) => trackEcommerce(name, data), []);

  const pageView = useCallback((path, title) => trackPageView(path, title), []);

  const userProps = useCallback((props) => setUserProperties(props), []);

  const exception = useCallback(
    (desc, fatal) => trackException(desc, fatal),
    []
  );

  return {
    track,
    trackEcom,
    pageView,
    userProps,
    exception,

    // Auth events
    trackLogin: _trackLogin,
    trackLogout: _trackLogout,
    trackSignUp: _trackSignUp,

    // Search
    trackSearch: _trackSearch,

    // Share
    trackShare: _trackShare,

    // Forms
    trackFormStart: _trackFormStart,
    trackFormSubmit: _trackFormSubmit,
    trackFormError: _trackFormError,

    // Ecommerce
    trackViewItem: _trackViewItem,
    trackViewItemList: _trackViewItemList,
    trackSelectItem: _trackSelectItem,
    trackAddToCart: _trackAddToCart,
    trackRemoveFromCart: _trackRemoveFromCart,
    trackViewCart: _trackViewCart,
    trackBeginCheckout: _trackBeginCheckout,
    trackAddShippingInfo: _trackAddShippingInfo,
    trackAddPaymentInfo: _trackAddPaymentInfo,
    trackPurchase: _trackPurchase,
    trackRefund: _trackRefund,
    trackAddToWishlist: _trackAddToWishlist,
    trackRemoveFromWishlist: _trackRemoveFromWishlist,

    // Errors
    track404: _track404,
    trackApiError: _trackApiError,
    trackPaymentFailure: _trackPaymentFailure,
    trackCheckoutError: _trackCheckoutError,
  };
};
