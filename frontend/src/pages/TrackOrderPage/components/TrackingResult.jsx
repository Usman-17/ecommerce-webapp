import { Package, Clock, TruckElectric, MapPinHouse, Ban } from "lucide-react";

import TrackingResultMobile from "./TrackingResultMobile";
import TrackingResultDesktop from "./TrackingResultDesktop";
// Imports End----

const TrackingResult = ({ order, onCancelClick }) => {
  if (!order) return null;

  const apiSteps = order.saleOrderTrackingWebRequests || [];

  // Map API steps to the 4 visual steps
  const visualSteps = [
    {
      label: "Order Placed",
      icon: Package,
      desc: "Your order has been placed successfully.",
      steps: [apiSteps[0]],
    },
    {
      label: "Processing",
      icon: Clock,
      desc: "We are processing your order.",
      steps: [apiSteps[1], apiSteps[2]],
    },
    {
      label: "Shipped",
      icon: TruckElectric,
      desc: "Your order is on the way.",
      steps: [apiSteps[3], apiSteps[4]],
    },
    {
      label: "Delivered",
      icon: MapPinHouse,
      desc: "Your order has been delivered.",
      steps: [apiSteps[5]],
    },
  ];

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("cancel")) return "bg-rose-50 text-rose-500 border-rose-100";
    if (s.includes("deliver"))
      return "bg-emerald-50 text-emerald-500 border-emerald-100";
    if (
      s.includes("ship") ||
      s.includes("courier") ||
      s.includes("rider") ||
      s.includes("way")
    )
      return "bg-indigo-50 text-indigo-500 border-indigo-100";
    if (
      s.includes("process") ||
      s.includes("prepar") ||
      s.includes("confirm") ||
      s.includes("placed") ||
      s.includes("pending")
    )
      return "bg-orange-50 text-orange-400 border-orange-100";
    return "bg-gray-50 text-gray-500 border-gray-100";
  };

  const isCancelled = order.saleOrderStatusName === "Cancelled";

  // Prepare the steps to display
  let stepsToDisplay = visualSteps.map((vStep) => {
    const completedSteps = vStep.steps.filter(
      (s) => s && s.saleOrderTrackingId > 0 && !s.createdOn.startsWith("1900"),
    );
    return {
      ...vStep,
      isCompleted: completedSteps.length > 0,
      latestStep: completedSteps[completedSteps.length - 1] || vStep.steps[0],
    };
  });

  if (isCancelled) {
    stepsToDisplay = stepsToDisplay.filter((s) => s.isCompleted);
    stepsToDisplay.push({
      label: "Order Cancelled",
      icon: Ban,
      desc: order.statusRemarks,
      isCompleted: true,
      isCancelled: true,
      latestStep: {
        createdOn: order.saleOrderOn,
        saleOrderStatusName: "Cancelled",
      },
    });
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block sm:hidden">
        <TrackingResultMobile
          order={order}
          onCancelClick={onCancelClick}
          getStatusStyle={getStatusStyle}
          stepsToDisplay={stepsToDisplay}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <TrackingResultDesktop
          order={order}
          onCancelClick={onCancelClick}
          getStatusStyle={getStatusStyle}
          stepsToDisplay={stepsToDisplay}
        />
      </div>
    </>
  );
};

export default TrackingResult;
