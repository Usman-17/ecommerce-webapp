import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  MapPinHouse,
  CalendarRange,
  ChevronLeft,
  TruckElectric,
} from "lucide-react";

import { vibrate } from "../../../utils/vibrate";
// Imports End-----

const OrderItemDesktop = ({ order, getStatusColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  // Summary calculations
  const subtotal = order.total || 0;
  const shippingCharge = 0;
  const discount = 0;
  const totalAmount = subtotal + shippingCharge - discount;

  const displayItems = isExpanded
    ? order.items
    : order.items?.slice(0, 3) || [];
  const remainingItemsCount = Math.max(0, (order.items?.length || 0) - 3);

  return (
    <div className="hidden md:block bg-white rounded-xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all duration-300 group">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-primary mb-0.5">
            Order #{order.orderNo}
          </h2>

          <p className="text-gray-400 text-[12px] font-semibold">
            Placed on {moment(order.date).format("MMM DD, YYYY [at] hh:mm A")}
          </p>
        </div>

        <span
          className={`text-[11px] font-black px-5 py-1 rounded-full border uppercase tracking-widest ${getStatusColor(
            order.status,
          )} bg-white`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-8 border-t border-gray-50 pt-8">
        {/* Left Section: Items List (Col 8) */}
        <div className="col-span-8 flex flex-col">
          <div className="space-y-6">
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 group/item transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-50 shrink-0 p-1.5 ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>

                  {item.selectedVariants?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {item.selectedVariants.map((variant, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {variant.detailName}
                          </span>

                          {vIdx < item.selectedVariants.length - 1 && (
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs font-medium text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[15px] font-bold text-primary">
                    Rs. {Math.floor(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {(remainingItemsCount > 0 || isExpanded) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 flex items-center gap-1.5 text-rose-500 text-[13px] font-bold hover:gap-2 transition-all w-fit"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp size={14} strokeWidth={3} />
                </>
              ) : (
                <>
                  <span>
                    + {remainingItemsCount} more{" "}
                    {remainingItemsCount === 1 ? "item" : "items"}
                  </span>
                  <ChevronDown size={14} strokeWidth={3} />
                </>
              )}
            </button>
          )}

          {/* Info Bar */}
          <div className="mt-auto pt-10">
            <div className="grid grid-cols-4 gap-4 bg-gray-50/30 rounded-xl p-5 border border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <ReceiptText size={18} className="text-rose-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                    Order ID
                  </p>

                  <p className="text-primary text-[12px] font-bold truncate">
                    #{order.orderNo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <Wallet size={18} className="text-rose-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                    Payment Method
                  </p>

                  <p className="text-primary text-[12px] font-bold truncate">
                    Cash on Delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <MapPinHouse size={18} className="text-rose-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                    Shipping Address
                  </p>

                  <p className="text-primary text-[12px] font-bold truncate">
                    {order.shippingInfo?.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <CalendarRange size={18} className="text-rose-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                    Estimated Delivery
                  </p>

                  <p className="text-primary text-[12px] font-bold truncate">
                    {moment(order.date).add(5, "days").format("MMM DD")} -{" "}
                    {moment(order.date).add(7, "days").format("MMM DD")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary (Col 4) */}
        <div className="col-span-4 border-l border-gray-50 pl-8 flex flex-col">
          <h4 className="text-[15px] font-black text-primary mb-6">
            Order Summary
          </h4>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-primary font-bold">
                Rs. {Math.floor(subtotal).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500 font-medium">Shipping Charge</span>
              <span className="text-primary font-bold">
                Rs. {shippingCharge}
              </span>
            </div>

            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500 font-medium">Discount</span>
              <span className="text-primary font-bold">- Rs. {discount}</span>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[14px] font-bold text-primary">
                Total Amount
              </span>

              <span className="text-[20px] font-black text-primary">
                <span className="text-[13px] mr-1 font-bold">Rs.</span>
                {Math.floor(totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-auto bg-amber-50/50 rounded-xl p-4 flex items-start gap-3 border border-amber-100/50">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Wallet size={20} className="text-amber-500" />
            </div>

            <p className="text-amber-700 text-[12px] font-semibold leading-relaxed max-w-50">
              You will pay in cash when your order is delivered.
            </p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-50">
        <button
          onClick={() => {
            navigate(`/order-details?id=${order.orderNo}`);
            vibrate(10);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded border border-rose-200 text-rose-500 font-bold text-[13px] hover:bg-rose-50 transition-all active:scale-[0.98]"
        >
          <ChevronLeft size={14} strokeWidth={2.5} className="rotate-180" />
          View Details
        </button>

        <button
          onClick={() => {
            navigate(`/track-order?id=${order.orderNo}`);
            vibrate(10);
          }}
          className="flex items-center gap-2 px-6 py-2 rounded bg-rose-500 text-white font-bold text-[13px] shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-[0.98]"
        >
          <TruckElectric size={16} />
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderItemDesktop;
