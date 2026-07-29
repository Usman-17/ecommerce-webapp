import { useEffect } from "react";
import { initAnalytics } from "../analytics/analytics";
import { initPerformanceTracking } from "../analytics/performance";
import {
  initScrollTracking,
  initOutboundTracking,
  trackTimeOnPage,
} from "../analytics/engagement";
import {
  initGlobalErrorTracking,
  initImageErrorTracking,
} from "../analytics/errors";
import { IS_ANALYTICS_ENABLED } from "../analytics/constants";

const AnalyticsProvider = ({ children }) => {
  useEffect(() => {
    if (!IS_ANALYTICS_ENABLED) return;

    initAnalytics();
    initPerformanceTracking();
    initGlobalErrorTracking();
    initImageErrorTracking();

    const cleanupScroll = initScrollTracking();
    const cleanupOutbound = initOutboundTracking();

    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      trackTimeOnPage();
      cleanupScroll?.();
      cleanupOutbound?.();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return children;
};

export default AnalyticsProvider;
