import { useQuery } from "@tanstack/react-query";

const useGetAllDeals = () => {
  const {
    data: deals,
    isLoading,
    isError,
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

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    deals: deals || [],
    dealIsLoading: isLoading,
    dealError: isError,
    dealRefetch: refetch,
    dealIsRefetching: isRefetching,
  };
};

export { useGetAllDeals };
