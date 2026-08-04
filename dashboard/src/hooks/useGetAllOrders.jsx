import { useQuery } from "@tanstack/react-query";

const useGetAllOrders = () => {
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/order/all");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return response.json();
    },

    select: (data) =>
      data.map((item, index) => ({
        ...item,
        key: item._id,
        sr: index + 1,
        customerName:
          `${item.address?.firstName || ""} ${item.address?.lastName || ""}`.trim(),
        customerPhone: item.address?.phone || "",
        amountStr: `Rs. ${(item.amount + (item.shippingCharge || 0)).toLocaleString()} ${item.amount + (item.shippingCharge || 0)}`,
        itemsCount: item.items?.length || 0,
        orderType: item.orderType || "normal",
        orderTypeLabel:
          item.orderType === "scoop"
            ? item.scoopDetails?.scoopType || "Scoop"
            : item.orderType === "deal"
              ? item.dealDetails?.dealType || "Deal"
              : "Normal",
        dateFormatted: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        timeFormatted: new Date(item.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    orders,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  };
};

export { useGetAllOrders };
