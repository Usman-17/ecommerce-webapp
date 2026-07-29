import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/authFetch";

const useTrackOrder = (trackingNo) => {
  return useQuery({
    queryKey: ["trackOrder", trackingNo],
    enabled: !!trackingNo,

    queryFn: async () => {
      const json = await apiRequest(
        `/api/SALE/WebOrder/GetByTrackingNo?TrackingNo=${encodeURIComponent(trackingNo)}`,
        { headers: { accept: "text/plain" } },
      );

      if (!json.data) {
        throw new Error(json.message || "No record found.");
      }

      return json.data;
    },
    retry: false,
  });
};

export default useTrackOrder;
