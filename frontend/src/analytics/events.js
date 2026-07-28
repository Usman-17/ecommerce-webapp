import { trackEvent } from "./analytics";
import { GA4_EVENTS } from "./constants";

export const trackLogin = (method = "email") => {
  trackEvent(GA4_EVENTS.LOGIN, {
    method,
  });
};

export const trackLogout = () => {
  trackEvent(GA4_EVENTS.LOGOUT, {});
};

export const trackSignUp = (method = "email") => {
  trackEvent(GA4_EVENTS.SIGN_UP, {
    method,
  });
};

export const trackSearch = (term, results = 0) => {
  trackEvent(GA4_EVENTS.SEARCH, {
    search_term: term,
    search_results: results,
  });
};

export const trackShare = (method, content_type, item_id) => {
  trackEvent(GA4_EVENTS.SHARE, {
    method,
    content_type,
    item_id: String(item_id),
  });
};

export const trackFormStart = (form_name) => {
  trackEvent(GA4_EVENTS.FORM_START, {
    form_name,
  });
};

export const trackFormSubmit = (form_name, success = true) => {
  trackEvent(GA4_EVENTS.FORM_SUBMIT, {
    form_name,
    success,
  });
};

export const trackFormError = (form_name, error_type) => {
  trackEvent(GA4_EVENTS.FORM_ERROR, {
    form_name,
    error_type,
  });
};

export const trackFileDownload = (file_name, file_extension, file_url) => {
  trackEvent(GA4_EVENTS.FILE_DOWNLOAD, {
    file_name,
    file_extension,
    file_url,
  });
};

export const trackOutboundClick = (url, domain) => {
  trackEvent(GA4_EVENTS.OUTBOUND_CLICK, {
    outbound_url: url,
    outbound_domain: domain,
  });
};

export const trackVideoPlay = (video_title, video_url, video_provider) => {
  trackEvent(GA4_EVENTS.VIDEO_PLAY, {
    video_title,
    video_url,
    video_provider,
  });
};

export const trackPromotionView = (
  promotion_id,
  promotion_name,
  creative_name,
  creative_slot,
) => {
  trackEvent(GA4_EVENTS.VIEW_PROMOTION, {
    promotion_id,
    promotion_name,
    creative_name,
    creative_slot,
  });
};

export const trackPromotionSelect = (
  promotion_id,
  promotion_name,
  creative_name,
  creative_slot,
) => {
  trackEvent(GA4_EVENTS.SELECT_PROMOTION, {
    promotion_id,
    promotion_name,
    creative_name,
    creative_slot,
  });
};
