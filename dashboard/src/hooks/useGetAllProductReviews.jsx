import { useQuery } from "@tanstack/react-query";

const useGetAllProductReviews = () => {
  const {
    data: productReviews,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["productReviews"],
    queryFn: async () => {
      const response = await fetch("/api/product-review/admin/all", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product reviews");
      }

      return response.json();
    },

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    productReviews,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  };
};

export { useGetAllProductReviews };
