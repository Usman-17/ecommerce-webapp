import { onLCP, onCLS, onFCP, onTTFB, onINP } from "web-vitals";
import { trackEvent } from "./analytics";
import { IS_ANALYTICS_ENABLED } from "./constants";

const sendToAnalytics = (metric) => {
  const eventData = {
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    event_category: "Web Vitals",
    non_interaction: true,
  };

  trackEvent(metric.name, eventData);
};

export const initPerformanceTracking = () => {
  if (!IS_ANALYTICS_ENABLED) return;

  try {
    onLCP(sendToAnalytics);
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  } catch {
    // web-vitals not supported in this browser
  }
};
