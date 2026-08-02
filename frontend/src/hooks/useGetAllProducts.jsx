import { useQuery } from "@tanstack/react-query";

const useGetAllProducts = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/product/all");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const products = Array.isArray(data) ? data : [];

  // Only active products
  const activeProducts = products.filter((p) => p.isActive === true);

  // helper
  const hasLink = (p, link) =>
    Array.isArray(p.webLinks) && p.webLinks.includes(link);

  // Pre-filtered product lists by web link (only active)
  const allProducts = activeProducts.filter((p) => hasLink(p, "All Products"));
  const bestSellerProducts = activeProducts.filter((p) => hasLink(p, "Best Sellers"));
  const newArrivalsProducts = activeProducts.filter((p) =>
    hasLink(p, "New Arrivals"),
  );
  const scoopProducts = activeProducts.filter((p) => hasLink(p, "Scoop"));
  const popularProducts = activeProducts.filter((p) => hasLink(p, "Popular"));
  const specialProducts = activeProducts.filter((p) => hasLink(p, "Special"));
  const saleProducts = activeProducts.filter((p) => hasLink(p, "Sale"));
  const trendingProducts = activeProducts.filter((p) => hasLink(p, "Trending"));

  return {
    products: activeProducts,
    allProducts,
    bestSellerProducts,
    newArrivalsProducts,
    scoopProducts,
    popularProducts,
    specialProducts,
    saleProducts,
    trendingProducts,
    productIsLoading: isLoading,
    productError: isError,
    productRefetch: refetch,
    productIsRefetching: isRefetching,
  };
};

export { useGetAllProducts };
