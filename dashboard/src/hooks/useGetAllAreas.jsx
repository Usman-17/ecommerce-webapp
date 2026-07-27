import { useQuery } from "@tanstack/react-query";

const useGetAllAreas = () => {
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

export { useGetAllAreas };
