const CART_KEY = "cart";

const migrateCookieToLocalStorage = () => {
  try {
    const nameEQ = "cart=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = JSON.parse(
          decodeURIComponent(c.substring(nameEQ.length, c.length)),
        );
        if (Array.isArray(value) && value.length > 0) {
          localStorage.setItem(CART_KEY, JSON.stringify(value));
        }
        document.cookie =
          "cart=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        break;
      }
    }
  } catch {
    // Migration failed — silently ignore
  }
};

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      migrateCookieToLocalStorage();
      const retry = localStorage.getItem(CART_KEY);
      if (!retry) return [];
      const parsed = JSON.parse(retry);
      return Array.isArray(parsed) ? parsed : [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently fail
  }
};

export const removeCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {
    // Silently fail
  }
};
