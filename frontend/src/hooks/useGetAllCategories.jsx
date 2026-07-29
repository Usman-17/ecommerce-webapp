import { useQuery } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/category/all");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },

    select: (data) =>
      data.map((item, index) => ({
        ...item,
        key: item._id,
        sr: index + 1,
      })),

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    categories,
    isLoading,
    isError,
    error,
  };
};
