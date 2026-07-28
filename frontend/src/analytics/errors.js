import { trackEvent } from "./analytics";
import { GA4_EVENTS, IS_ANALYTICS_ENABLED } from "./constants";

export const track404 = (path) => {
  trackEvent(GA4_EVENTS.EXCEPTION, {
    description: `404 - Page Not Found: ${path}`,
    fatal: false,
    page_path: path,
  });
};

export const trackApiError = (endpoint, statusCode, message = "") => {
  trackEvent(GA4_EVENTS.API_ERROR, {
    endpoint,
    status_code: statusCode,
    error_message: String(message).substring(0, 200),
    page_path: window.location.pathname,
  });
};

export const trackPaymentFailure = (reason, orderId = null) => {
  trackEvent(GA4_EVENTS.PAYMENT_FAILURE, {
    failure_reason: reason,
    order_id: orderId ? String(orderId) : "",
    page_path: window.location.pathname,
  });
};

export const trackCheckoutError = (step, reason) => {
  trackEvent(GA4_EVENTS.CHECKOUT_ERROR, {
    checkout_step: step,
    error_reason: reason,
    page_path: window.location.pathname,
  });
};

export const initGlobalErrorTracking = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  // Unhandled JS errors
  const handleError = (event) => {
    const message = event.message || "Unknown error";
    const source = event.filename || "unknown";
    const line = event.lineno || 0;
    const col = event.colno || 0;

    trackEvent(GA4_EVENTS.JS_ERROR, {
      error_message: message.substring(0, 500),
      error_source: source,
      error_line: line,
      error_column: col,
      page_path: window.location.pathname,
      user_agent: navigator.userAgent.substring(0, 200),
    });
  };

  // Unhandled promise rejections
  const handleRejection = (event) => {
    const reason = event.reason;
    trackEvent(GA4_EVENTS.JS_ERROR, {
      error_message: `Unhandled Promise: ${String(reason).substring(0, 500)}`,
      error_source: "promise_rejection",
      page_path: window.location.pathname,
    });
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
};

export const initImageErrorTracking = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  const handleImageError = (e) => {
    const img = e.target;
    if (img && img.tagName === "IMG" && img.src) {
      trackEvent("image_error", {
        image_url: img.src.substring(0, 500),
        page_path: window.location.pathname,
      });
    }
  };

  document.addEventListener("error", handleImageError, true);
  return () => document.removeEventListener("error", handleImageError, true);
};
