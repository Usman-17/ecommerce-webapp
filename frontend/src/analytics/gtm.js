import TagManager from "react-gtm-module";
import { GTM_ID, IS_ANALYTICS_ENABLED, IS_DEBUG_MODE } from "./constants";
import { safePush } from "./helpers";

let gtmLoaded = false;

export const initGTM = () => {
  if (!IS_ANALYTICS_ENABLED || !GTM_ID || gtmLoaded) return;

  TagManager.initialize({
    gtmId: GTM_ID,
    auth: "",
    preview: "",
    events: {},
    dataLayer: {
      page_path: window.location.pathname,
      page_title: document.title,
    },
    dataLayerName: "dataLayer",
  });

  gtmLoaded = true;

  if (IS_DEBUG_MODE) {
    console.log("[GTM] Initialized with ID:", GTM_ID);
  }
};

export const pushToDataLayer = (data) => {
  safePush(window.dataLayer, data);
};

export const gtmEvent = (eventName, data = {}) => {
  pushToDataLayer({
    event: eventName,
    ...data,
  });

  if (IS_DEBUG_MODE) {
    console.log("[GTM Event]", eventName, data);
  }
};

export const setGTMUserProperties = (properties = {}) => {
  pushToDataLayer({
    event: "user_properties",
    user_properties: properties,
  });
};
