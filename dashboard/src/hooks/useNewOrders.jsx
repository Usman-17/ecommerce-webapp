import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const useNewOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["newOrders"],
    queryFn: async () => {
      const res = await fetch("/api/order/recent");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch");
      return json;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const lastSeenAt = localStorage.getItem("notifications_lastSeenAt");
  const unseenCount = data
    ? data.filter(
        (o) => !lastSeenAt || new Date(o.createdAt) > new Date(lastSeenAt),
      ).length
    : 0;

  const markAsSeen = () => {
    localStorage.setItem("notifications_lastSeenAt", new Date().toISOString());
  };

  const orders = (data || []).map((order) => ({
    ...order,
    timeAgo: moment(order.createdAt).fromNow(),
  }));

  return { orders, unseenCount, isLoading, markAsSeen };
};

export default useNewOrders;
