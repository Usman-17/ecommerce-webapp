import { useQuery } from "@tanstack/react-query";

export const useGetAllProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/product/all");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },

    select: (data) =>
      data.map((item, index) => ({
        ...item,
        key: item._id,
        sr: index + 1,
        categoryName: item.categoryName || "-",
        areaName: item.areaName || "-",
        subCategoryName: item.subCategoryName || "-",
        brandName: item.brandName || "-",
        productImage: item.productImages?.[0]?.url || "",
      })),

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};
