import moment from "moment";
import { motion as Motion } from "framer-motion";
import {
  Package,
  TruckElectric,
  MapPinHouse,
  CreditCard,
  Ban,
} from "lucide-react";

import { vibrate } from "../../../utils/vibrate";
// Imports End------

const TrackingResultMobile = ({
  order,
  onCancelClick,
  getStatusStyle,
  stepsToDisplay,
}) => {
  const address = order.address || {};

  return (
    <div className="space-y-2.5 mb-2 px-1">
      {/* Mobile Header Card */}
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[14px] sm:text-lg font-black text-primary flex items-center gap-2">
              {order.trackingNo}
            </h3>

            <p className="text-gray-400 text-[12px] font-medium mt-1">
              {moment(order.createdAt).isValid()
                ? moment(order.createdAt).format("MMM DD, YYYY [at] hh:mm A")
                : "Order Date Unavailable"}
            </p>
          </div>

          <span
            className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase sm:tracking-wider ${getStatusStyle(
              order.status,
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              <CreditCard size={14} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Payment
              </p>
              <p className="text-[11px] text-primary font-black truncate">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              <Package size={14} />
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Total
              </p>
              <p className="text-[11px] text-primary font-black truncate">
                Rs.{" "}
                {(order.amount + (order.shippingCharge || 0))?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* Mobile Status Timeline Card */}
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50"
      >
        <h4 className="text-[15px] font-black text-primary mb-6 flex items-center gap-2">
          <TruckElectric size={18} className="text-accent" />
          Tracking Status
        </h4>

        <div className="space-y0 relative">
          {stepsToDisplay.map((vStep, idx) => {
            const isCompleted = vStep.isCompleted;
            const nextStepIsCompleted =
              idx < stepsToDisplay.length - 1 &&
              stepsToDisplay[idx + 1].isCompleted;
            const isCurrent = isCompleted && !nextStepIsCompleted;

            return (
              <div key={idx} className="flex gap-4 min-h-17.5">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                      vStep.isCancelled
                        ? "bg-red-500 text-white"
                        : isCompleted
                          ? "bg-accent text-white"
                          : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    <vStep.icon
                      size={14}
                      className={
                        isCurrent && !vStep.isCancelled ? "animate-pulse" : ""
                      }
                    />
                  </div>
                  {idx < stepsToDisplay.length - 1 && (
                    <div
                      className={`w-0.5 grow my-1 transition-colors duration-500 ${
                        nextStepIsCompleted ? "bg-accent" : "bg-gray-100"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5
                        className={`text-[13px] font-black transition-colors ${
                          vStep.isCancelled
                            ? "text-red-500"
                            : isCompleted
                              ? "text-primary"
                              : "text-gray-300"
                        }`}
                      >
                        {vStep.label}
                      </h5>
                      <p
                        className={`text-[11px] font-bold mt-0.5 ${isCompleted ? "text-gray-500" : "text-gray-300"}`}
                      >
                        {vStep.desc}
                      </p>
                    </div>

                    {isCompleted && vStep.timestamp && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold">
                          {new Date(vStep.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-[9px] text-gray-300 font-bold uppercase">
                          {new Date(vStep.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Motion.div>

      {/* Mobile Shipping Address Card */}
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50"
      >
        <h4 className="text-[15px] font-black text-primary mb-4 flex items-center gap-2">
          <MapPinHouse size={18} className="text-accent" />
          Shipping Address
        </h4>

        <div className="text-[13px] text-gray-500 font-bold leading-relaxed">
          <p className="text-primary font-black mb-1">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.address}</p>
          <p>{address.city}</p>
          <p className="mt-2 text-[11px] text-gray-400 font-bold">
            {address.phone}
          </p>
        </div>
      </Motion.div>

      {/* Cancel Order Button Mobile */}
      {!["Shipped", "Delivered", "Cancelled"].includes(order.status) && (
        <Motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            onCancelClick();
            vibrate(10);
          }}
          className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-all shadow-lg"
        >
          <Ban size={16} />
          Cancel Order
        </Motion.button>
      )}
    </div>
  );
};

export default TrackingResultMobile;
