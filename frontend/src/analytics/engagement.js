import { trackEvent } from "./analytics";
import { GA4_EVENTS, IS_ANALYTICS_ENABLED } from "./constants";
import { throttle } from "./helpers";

let scrollTracked = { 25: false, 50: false, 75: false, 90: false };
let pageLoadTime = Date.now();
let maxScrollDepth = 0;

export const resetScrollTracking = () => {
  scrollTracked = { 25: false, 50: false, 75: false, 90: false };
  maxScrollDepth = 0;
};

export const initScrollTracking = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  const handleScroll = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);

    const thresholds = [25, 50, 75, 90];
    for (const threshold of thresholds) {
      if (scrollPercent >= threshold && !scrollTracked[threshold]) {
        scrollTracked[threshold] = true;
        trackEvent(GA4_EVENTS.SCROLL, {
          scroll_depth: threshold,
          page_path: window.location.pathname,
        });
      }
    }
  }, 500);

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
};

export const getTimeOnPage = () => {
  return Math.round((Date.now() - pageLoadTime) / 1000);
};

export const trackTimeOnPage = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  const seconds = getTimeOnPage();
  trackEvent("time_on_page", {
    time_seconds: seconds,
    page_path: window.location.pathname,
    max_scroll_depth: maxScrollDepth,
  });
};

export const trackOutboundClick = (url) => {
  if (!IS_ANALYTICS_ENABLED) return;

  try {
    const hostname = new URL(url).hostname;
    const currentHostname = window.location.hostname;
    if (hostname !== currentHostname) {
      trackEvent(GA4_EVENTS.OUTBOUND_CLICK, {
        outbound_url: url,
        outbound_domain: hostname,
        page_path: window.location.pathname,
      });
    }
  } catch {
    // Invalid URL
  }
};

export const initOutboundTracking = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  const handleClick = (e) => {
    const anchor = e.target.closest("a[href]");
    if (anchor && anchor.href) {
      trackOutboundClick(anchor.href);
    }
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
};

export const resetEngagementTracking = () => {
  pageLoadTime = Date.now();
  resetScrollTracking();
};
