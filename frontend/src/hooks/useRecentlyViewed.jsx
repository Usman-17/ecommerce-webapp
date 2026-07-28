import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 20;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(
        (item) => item.productId !== product.productId,
      );
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const removeRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
    removeRecentlyViewed,
    clearRecentlyViewed,
  };
};
