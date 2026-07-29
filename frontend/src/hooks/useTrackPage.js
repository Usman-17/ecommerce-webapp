import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../analytics/analytics";
import { IS_ANALYTICS_ENABLED } from "../analytics/constants";
import { resetScrollTracking } from "../analytics/engagement";

const useTrackPage = () => {
  const { pathname, search } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (!IS_ANALYTICS_ENABLED) return;

    const fullPath = pathname + search;

    // Only track if path actually changed (not on search param changes for same page)
    if (prevPath.current !== pathname) {
      trackPageView(fullPath);
      resetScrollTracking();
    } else if (search) {
      // Track search param changes on same page (e.g., /shop?category=X)
      trackPageView(fullPath);
    }

    prevPath.current = pathname;
  }, [pathname, search]);
};

export default useTrackPage;
