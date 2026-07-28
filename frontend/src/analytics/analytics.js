import ReactGA from "react-ga4";
import clarity from "@microsoft/clarity";
import {
  GA_MEASUREMENT_ID,
  GTM_ID,
  CLARITY_ID,
  IS_ANALYTICS_ENABLED,
  IS_DEBUG_MODE,
  CURRENCY,
} from "./constants";
import { initGTM, pushToDataLayer } from "./gtm";

let initialized = false;

export const initAnalytics = () => {
  if (!IS_ANALYTICS_ENABLED || initialized) return;

  // Initialize GA4 via react-ga4
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: IS_DEBUG_MODE,
      gaOptions: {
        cookieDomain: "auto",
        cookieFlags: "SameSite=None;Secure",
      },
    });
  }

  // Initialize GTM
  if (GTM_ID) {
    initGTM();
  }

  // Initialize Microsoft Clarity
  if (CLARITY_ID) {
    clarity.init(CLARITY_ID);
  }

  initialized = true;

  if (IS_DEBUG_MODE) {
    console.log("[Analytics] Initialized", { GA_MEASUREMENT_ID, GTM_ID, CLARITY_ID });
  }
};

export const trackPageView = (path, title) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  const pageData = {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  };

  // GA4 page view via react-ga4
  if (GA_MEASUREMENT_ID) {
    ReactGA.send("page_view", pageData);
  }

  // GTM page view
  pushToDataLayer({
    event: "page_view",
    ...pageData,
  });

  if (IS_DEBUG_MODE) {
    console.log("[Analytics] Page View", path);
  }
};

export const trackEvent = (name, params = {}) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  // GA4 event via react-ga4
  ReactGA.event(name, params);

  // GTM event
  pushToDataLayer({
    event: name,
    ...params,
  });

  if (IS_DEBUG_MODE) {
    console.log("[Analytics] Event:", name, params);
  }
};

export const trackEcommerce = (name, data = {}) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  // GA4 ecommerce event
  ReactGA.event(name, {
    currency: CURRENCY,
    value: data.value || 0,
    ...data,
  });

  // GTM ecommerce event
  pushToDataLayer({
    event: name,
    ecommerce: {
      currencyCode: CURRENCY,
      ...data,
    },
  });

  if (IS_DEBUG_MODE) {
    console.log("[Analytics] Ecommerce:", name, data);
  }
};

export const setUserProperties = (properties) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  ReactGA.set(properties);

  pushToDataLayer({
    event: "set_user_properties",
    user_properties: properties,
  });
};

export const trackException = (description, fatal = false) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  ReactGA.event("exception", {
    description,
    fatal,
  });

  pushToDataLayer({
    event: "exception",
    exception_description: description,
    exception_fatal: fatal,
  });
};

export const trackTiming = (category, variable, value, label) => {
  if (!IS_ANALYTICS_ENABLED || !initialized) return;

  ReactGA.event("timing_complete", {
    name: variable,
    value: Number(value),
    event_category: category,
    event_label: label,
  });
};

export const getAnalyticsReady = () => initialized;

export const tagClarity = (name, value) => {
  if (!CLARITY_ID || !initialized) return;
  clarity.tag(name, value);
};

export { ReactGA };
