import { useQuery } from "@tanstack/react-query";

export const useGetAllAreas = () => {
  const {
    data: areas,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await fetch("/api/area/all");
      if (!response.ok) {
        throw new Error("Failed to fetch areas");
      }
      return response.json();
    },
    select: (data) =>
      data.map((item, index) => ({
        ...item,
        key: item._id,
        sr: index + 1,
        productAreaName: item.name,
      })),
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    areas,
    isLoading,
    isError,
    error,
  };
};
