import { useQuery } from "@tanstack/react-query";

const useGetAllCategories = () => {
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

    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    categories,
    categoryIsLoading: isLoading,
    isError,
    error,
  };
};

export { useGetAllCategories };
