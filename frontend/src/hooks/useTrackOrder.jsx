import { useQuery } from "@tanstack/react-query";

const useTrackOrder = (trackingNo) => {
  return useQuery({
    queryKey: ["trackOrder", trackingNo],
    enabled: !!trackingNo,

    queryFn: async () => {
      const res = await fetch(
        `/api/order/track?trackingNo=${encodeURIComponent(trackingNo)}`,
      );

      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || "No record found.");
      }

      return json.data;
    },
    retry: false,
  });
};

export default useTrackOrder;
