import Fuse from "fuse.js";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const FUSE_THRESHOLD = 0.38;
const MAX_SUGGESTIONS = 5;
const DEBOUNCE_MS = 250;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function highlightMatch(text, indices) {
  if (!indices || indices.length === 0) return text;

  const chars = text.split("");
  const highlighted = [];
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    if (start > lastIndex) {
      highlighted.push({
        text: chars.slice(lastIndex, start).join(""),
        highlight: false,
      });
    }
    highlighted.push({
      text: chars.slice(start, end + 1).join(""),
      highlight: true,
    });
    lastIndex = end + 1;
  });

  if (lastIndex < chars.length) {
    highlighted.push({
      text: chars.slice(lastIndex).join(""),
      highlight: false,
    });
  }

  return highlighted;
}

export function useFuzzySearch({
  products = [],
  categories = [],
  subCategories = [],
  areas = [],
  searchTerm,
}) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(inputValue, DEBOUNCE_MS);
  const inputRef = useRef(null);

  const fuseProducts = useMemo(
    () =>
      new Fuse(products, {
        keys: ["title"],
        threshold: FUSE_THRESHOLD,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [products],
  );

  const fuseCategories = useMemo(
    () =>
      new Fuse(categories, {
        keys: ["name"],
        threshold: FUSE_THRESHOLD,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [categories],
  );

  const fuseSubCategories = useMemo(
    () =>
      new Fuse(subCategories, {
        keys: ["name"],
        threshold: FUSE_THRESHOLD,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [subCategories],
  );

  const fuseAreas = useMemo(
    () =>
      new Fuse(areas, {
        keys: ["name"],
        threshold: FUSE_THRESHOLD,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [areas],
  );

  // Normal exact search (case-insensitive includes)
  const normalProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return products.filter((p) => (p.title || "").toLowerCase().includes(q));
  }, [debouncedSearch, products]);

  const normalCategories = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return categories.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [debouncedSearch, categories]);

  const normalSubCategories = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return subCategories.filter((s) =>
      (s.name || "").toLowerCase().includes(q),
    );
  }, [debouncedSearch, subCategories]);

  const normalAreas = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return areas.filter((a) => (a.name || "").toLowerCase().includes(q));
  }, [debouncedSearch, areas]);

  const hasNormalResults =
    normalProducts.length > 0 ||
    normalCategories.length > 0 ||
    normalSubCategories.length > 0 ||
    normalAreas.length > 0;

  // Fuzzy suggestions (only when no normal results)
  const suggestions = useMemo(() => {
    if (!debouncedSearch.trim() || hasNormalResults) return [];

    const productSuggestions = fuseProducts
      .search(debouncedSearch)
      .slice(0, MAX_SUGGESTIONS)
      .map((r) => ({
        type: "product",
        item: r.item,
        text: r.item.title,
        matches: r.matches?.[0]?.indices || [],
      }));

    const categorySuggestions = fuseCategories
      .search(debouncedSearch)
      .slice(0, MAX_SUGGESTIONS)
      .map((r) => ({
        type: "category",
        item: r.item,
        text: r.item.name,
        matches: r.matches?.[0]?.indices || [],
      }));

    const subCategorySuggestions = fuseSubCategories
      .search(debouncedSearch)
      .slice(0, MAX_SUGGESTIONS)
      .map((r) => ({
        type: "subcategory",
        item: r.item,
        text: r.item.name,
        matches: r.matches?.[0]?.indices || [],
      }));

    const areaSuggestions = fuseAreas
      .search(debouncedSearch)
      .slice(0, MAX_SUGGESTIONS)
      .map((r) => ({
        type: "area",
        item: r.item,
        text: r.item.name,
        matches: r.matches?.[0]?.indices || [],
      }));

    return [
      ...productSuggestions,
      ...categorySuggestions,
      ...subCategorySuggestions,
      ...areaSuggestions,
    ].slice(0, MAX_SUGGESTIONS);
  }, [
    debouncedSearch,
    hasNormalResults,
    fuseProducts,
    fuseCategories,
    fuseSubCategories,
    fuseAreas,
  ]);

  const applySuggestion = useCallback((text) => {
    setInputValue(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const highlight = useCallback(
    (text, indices) => highlightMatch(text, indices),
    [],
  );

  return {
    inputValue,
    setInputValue,
    debouncedSearch,
    normalProducts,
    normalCategories,
    normalSubCategories,
    normalAreas,
    hasNormalResults,
    suggestions,
    highlight,
    applySuggestion,
    inputRef,
  };
}
