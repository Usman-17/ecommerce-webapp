import { useQuery } from "@tanstack/react-query";

const useGetSubCategoriesByCategory = (categoryId) => {
  const {
    data: subCategories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/subcategory/category/${categoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
      }
      return response.json();
    },
    enabled: !!categoryId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    subCategories,
    isLoading,
    isError,
    error,
  };
};

export { useGetSubCategoriesByCategory };
