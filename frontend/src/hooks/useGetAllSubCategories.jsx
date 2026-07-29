import { useQuery } from "@tanstack/react-query";

export const useGetAllSubCategories = () => {
  const {
    data: subCategories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subCategories"],
    queryFn: async () => {
      const response = await fetch("/api/subcategory/all");

      if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
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
    subCategories,
    isLoading,
    isError,
    error,
  };
};
