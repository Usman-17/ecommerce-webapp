import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "../../utils/authFetch";
import useTrackOrder from "../../hooks/useTrackOrder";

import QuickLinks from "../../components/QuickLinks";

import TrackingHeader from "./components/TrackingHeader";
import TrackingResult from "./components/TrackingResult";
import CancelOrderModal from "./components/CancelOrderModal";
import StillHaveQuestions from "../../components/StillHaveQuestions";
import SEO from "../../components/SEO";
// Imports End-----

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [orderNumberInput, setOrderNumberInput] = useState(initialId);
  const [trackingNo, setTrackingNo] = useState(initialId);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelRemarks, setCancelRemarks] = useState("");

  // Sync state with URL parameter if it changes (Adjusting state during rendering)
  const [prevInitialId, setPrevInitialId] = useState(initialId);
  if (initialId !== prevInitialId) {
    setPrevInitialId(initialId);
    if (initialId) {
      setTrackingNo(initialId);
      setOrderNumberInput(initialId);
    }
  }

  const queryClient = useQueryClient();

  // Fetch order by tracking number
  const {
    data: order,
    isLoading,
    isError,
    error: queryError,
  } = useTrackOrder(trackingNo);

  // Cancel order mutation
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async ({ id, remarks }) => {
      return await apiRequest(
        `/api/SALE/WebOrder/CancelWeb?Id=${id}&StatusRemarks=${encodeURIComponent(remarks)}`,
        { method: "POST" },
      );
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["trackOrder", trackingNo] });
      setShowCancelModal(false);
      setCancelRemarks("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });

  const handleCancelConfirm = () => {
    if (order?.saleOrderId) {
      cancelOrder({ id: order.saleOrderId, remarks: cancelRemarks });
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNumberInput.trim()) {
      setTrackingNo(orderNumberInput.trim());
    }
  };

  return (
    <div className="md:py-4 lg:px-[4vw]">
      <SEO
        title="Track Your Order"
        description="Track your Jemzy order in real-time. Enter your order ID to check delivery status for jewelry, makeup, and hair accessories."
        keywords="track order, order status, delivery tracking, shipment status"
        url="/track-order"
      />
      <div className="flex flex-col sm:flex-row sm:gap-8">
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Track Your Order" />

          <StillHaveQuestions />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className={order ? "hidden" : "block"}>
            <TrackingHeader
              orderNumberInput={orderNumberInput}
              setOrderNumberInput={setOrderNumberInput}
              handleTrack={handleTrack}
              isLoading={isLoading}
              isError={isError}
              queryError={queryError}
            />
          </div>

          <TrackingResult
            order={order}
            onCancelClick={() => setShowCancelModal(true)}
          />

          <CancelOrderModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelConfirm}
            remarks={cancelRemarks}
            setRemarks={setCancelRemarks}
            isPending={isCancelling}
          />
        </main>
      </div>
    </div>
  );
};

export default TrackOrderPage;
