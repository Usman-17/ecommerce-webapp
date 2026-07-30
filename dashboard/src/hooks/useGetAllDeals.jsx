import { useQuery } from "@tanstack/react-query";

export const useGetAllDeals = () => {
  const {
    data: deals,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const response = await fetch("/api/deal/all");
      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }
      return response.json();
    },

    select: (data) =>
      data.map((item, index) => ({
        ...item,
        key: item._id,
        sr: index + 1,
        productsCount: item.products?.length || 0,
        imagesCount: item.images?.length || 0,
        dealPriceStr: `Rs. ${item.dealPrice?.toLocaleString()}`,
        originalPriceStr: item.originalPrice
          ? `Rs. ${item.originalPrice.toLocaleString()}`
          : "-",
      })),

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    deals,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};
