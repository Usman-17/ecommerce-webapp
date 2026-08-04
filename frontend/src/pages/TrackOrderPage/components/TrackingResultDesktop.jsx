import { motion as Motion } from "framer-motion";
import {
  ReceiptText,
  CalendarRange,
  CreditCard,
  MapPinHouse,
  Ban,
  ShieldCheck,
} from "lucide-react";
// Imports End----

const TrackingResultDesktop = ({
  order,
  onCancelClick,
  getStatusStyle,
  stepsToDisplay,
}) => {
  const address = order.address || {};

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50"
    >
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-5">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-primary">
              Track Your Order
            </h3>

            <p className="text-xs text-gray-400 font-bold mt-0.5">
              Real-time updates on your order journey
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black border self-start uppercase tracking-widest ${getStatusStyle(
            order.status,
          )}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              order.status === "Cancelled"
                ? "bg-red-500"
                : "bg-accent animate-pulse"
            } ${order.status === "Delivered" ? "animate-none" : ""}`}
          />
          {order.status || "Processing"}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Tracking Number",
            value: order.trackingNo,
            icon: ReceiptText,
          },

          {
            label: "Order Date",
            value: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Date not available",
            icon: CalendarRange,
          },

          {
            label: "Payment Method",
            value: order.paymentMethod,
            icon: CreditCard,
          },
        ].map((info, idx) => (
          <div
            key={idx}
            className="bg-gray-50/30 border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent">
              <info.icon size={18} />
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                {info.label}
              </p>

              <p className="text-sm text-primary font-black mt-0.5">
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_350px] gap-8">
        {/* Status Timeline */}
        <div className="space-y-8 relative pt-4">
          {stepsToDisplay.map((vStep, idx) => {
            const isCompleted = vStep.isCompleted;

            const nextStepIsCompleted =
              idx < stepsToDisplay.length - 1 &&
              stepsToDisplay[idx + 1].isCompleted;

            const isCurrent = isCompleted && !nextStepIsCompleted;

            return (
              <div key={idx} className="flex items-start gap-6 relative z-10">
                {/* Connector Line */}
                {idx < stepsToDisplay.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 -bottom-8 w-0.5 -translate-x-1/2 transition-colors duration-500 ${
                      nextStepIsCompleted ? "bg-accent" : "bg-gray-100"
                    } ${vStep.isCancelled ? "bg-red-500" : ""}`}
                  />
                )}

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-all duration-500 ${
                    vStep.isCancelled
                      ? "bg-red-500 text-white"
                      : isCompleted
                        ? "bg-accent text-white"
                        : "bg-gray-50 text-gray-300"
                  }`}
                >
                  <vStep.icon
                    size={20}
                    className={
                      isCurrent &&
                      vStep.label !== "Delivered" &&
                      !vStep.isCancelled
                        ? "animate-pulse"
                        : ""
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-black transition-colors ${
                          vStep.isCancelled
                            ? "text-red-500"
                            : isCompleted
                              ? "text-primary"
                              : "text-gray-300"
                        }`}
                      >
                        {vStep.label}
                      </h4>

                      <p
                        className={`text-xs font-bold mt-1 ${isCompleted ? "text-gray-500" : "text-gray-300"}`}
                      >
                        {vStep.desc}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
                          vStep.isCancelled
                            ? "bg-red-50 text-red-500"
                            : isCompleted
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-300"
                        }`}
                      >
                        {vStep.isCancelled
                          ? "Cancelled"
                          : isCompleted
                            ? "✓ Completed"
                            : "Pending"}
                      </span>

                      {isCompleted && vStep.timestamp && (
                        <p
                          className={`text-[11px] font-bold ${vStep.isCancelled ? "text-red-500" : "text-gray-400"}`}
                        >
                          {new Date(vStep.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          •{" "}
                          {new Date(vStep.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-primary mb-6 flex items-center gap-3 whitespace-nowrap text-sm">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                <MapPinHouse size={20} />
              </div>
              Delivery Address
            </h4>

            <div className="text-xs text-gray-500 font-bold leading-relaxed mb-8">
              <p className="text-primary font-black text-sm mb-1.5">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address}</p>
              <p>{address.city}</p>
              <p className="mt-3 text-xs text-gray-400">{address.phone}</p>
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-black text-xs uppercase tracking-widest">
                  Total Amount
                </span>
                <span className="text-accent font-black text-lg">
                  Rs. {(order.amount + (order.shippingCharge || 0))?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cancel Order Button */}
            {!["Shipped", "Delivered", "Cancelled"].includes(order.status) && (
              <button
                onClick={onCancelClick}
                className="w-full mt-8 flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 border-red-50 text-red-500 font-black text-sm hover:bg-red-50 transition-all group"
              >
                <Ban
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
                Cancel Order
              </button>
            )}

            <div className="mt-6 bg-gray-50/50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-primary font-black">
                  Secure Transaction
                </p>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                  Your data is protected by industry standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default TrackingResultDesktop;
