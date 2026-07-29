import { Package, Clock, TruckElectric, MapPinHouse, Ban } from "lucide-react";

import TrackingResultMobile from "./TrackingResultMobile";
import TrackingResultDesktop from "./TrackingResultDesktop";
// Imports End----

const TrackingResult = ({ order, onCancelClick }) => {
  if (!order) return null;

  const statusOrder = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex =
    order.status === "Cancelled" ? -1 : statusOrder.indexOf(order.status);

  const visualSteps = [
    {
      label: "Order Placed",
      icon: Package,
      desc: "Your order has been placed successfully.",
      isCompleted: currentStatusIndex >= 0,
      timestamp: currentStatusIndex >= 0 ? order.createdAt : null,
    },
    {
      label: "Processing",
      icon: Clock,
      desc: "We are processing your order.",
      isCompleted: currentStatusIndex >= 1,
      timestamp: currentStatusIndex >= 1 ? order.updatedAt : null,
    },
    {
      label: "Shipped",
      icon: TruckElectric,
      desc: "Your order is on the way.",
      isCompleted: currentStatusIndex >= 2,
      timestamp: currentStatusIndex >= 2 ? order.updatedAt : null,
    },
    {
      label: "Delivered",
      icon: MapPinHouse,
      desc: "Your order has been delivered.",
      isCompleted: currentStatusIndex >= 3,
      timestamp: order.deliveredAt || null,
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

  let stepsToDisplay = visualSteps;

  if (order.status === "Cancelled") {
    stepsToDisplay = stepsToDisplay.filter((s) => s.isCompleted);
    stepsToDisplay.push({
      label: "Order Cancelled",
      icon: Ban,
      desc: order.cancelRemarks || "This order has been cancelled.",
      isCompleted: true,
      isCancelled: true,
      timestamp: order.cancelledAt,
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
