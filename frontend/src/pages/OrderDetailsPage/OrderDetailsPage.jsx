import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useTrackOrder from "../../hooks/useTrackOrder";

import OrderDetailsMobile from "./components/OrderDetailsMobile";
import OrderDetailsDesktop from "./components/OrderDetailsDesktop";
// Imports End----

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderNo = queryParams.get("id");

  //  Fetch tracking data
  const { data: trackData, isLoading: isTrackingLoading } =
    useTrackOrder(orderNo);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;

          if (Math.abs(scrollDelta) > 5) {
            setIsVisible(scrollDelta < 0);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await fetch("/api/order/userorders", {
        credentials: "include",
      });
      if (!res.ok) return [];
      return (await res.json())?.orders || [];
    },
  });

  const order =
    orders.find((o) => String(o.trackingNo) === String(orderNo)) || null;

  const loading = isTrackingLoading && !order;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("cancel")) return "bg-rose-50 text-rose-500 border-rose-100";
    if (s.includes("deliver"))
      return "bg-emerald-50 text-emerald-500 border-emerald-100";
    if (
      s.includes("ship") ||
      s.includes("courier") ||
      s.includes("rider") ||
      s.includes("way") ||
      s.includes("out for delivery")
    )
      return "bg-indigo-50 text-indigo-500 border-indigo-100";
    if (
      s.includes("process") ||
      s.includes("prepar") ||
      s.includes("confirm") ||
      s.includes("placed") ||
      s.includes("pending") ||
      s.includes("pack")
    )
      return "bg-orange-50 text-orange-400 border-orange-100";
    return "bg-gray-50 text-gray-500 border-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleTrackOrder = () => {
    if (orderNo) {
      navigate(`/track-order?id=${orderNo}`);
    }
  };

  return (
    <div className="min-h-[60vh] md:py-4 lg:px-[4vw]">
      {/* Mobile Layout */}
      <OrderDetailsMobile
        order={order}
        getStatusColor={getStatusColor}
        isVisible={isVisible}
        isTrackingLoading={isTrackingLoading}
        trackData={trackData}
        handleTrackOrder={handleTrackOrder}
      />

      {/* Desktop Layout */}
      <OrderDetailsDesktop
        order={order}
        getStatusColor={getStatusColor}
        isTrackingLoading={isTrackingLoading}
        trackData={trackData}
        handleTrackOrder={handleTrackOrder}
      />
    </div>
  );
};

export default OrderDetailsPage;
