import moment from "moment";
import { motion as Motion } from "framer-motion";

import { vibrate } from "../../../utils/vibrate";
// Imports End----

const OrderDetailsMobile = ({
  order,
  getStatusColor,
  isVisible,
  isTrackingLoading,
  trackData,
  handleTrackOrder,
}) => {
  if (!order) return null;

  const total = (Number(order.amount) || 0) + (Number(order.shippingCharge) || 0);
  const subtotal =
    order.items?.reduce(
      (acc, item) =>
        acc + Number(item.price || 0) * (Number(item.quantity) || 1),
      0,
    ) || 0;
  const shipping = order.shippingCharge || 0;
  const discount = 0;

  return (
    <div className="md:hidden px-1 pt-0 pb-10 sm:pb-12">
      <div className="relative z-20">
        {/* Main Info Card */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start bg-white p-4 rounded-xl border-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div>
              <h2 className="text-[14px] font-black text-primary">
                Order #{order.trackingNo}
              </h2>

              <p className="text-gray-400 text-[12px] font-medium mt-1">
                {moment(order.date).isValid()
                  ? moment(order.date).format("MMM DD, YYYY [at] hh:mm A")
                  : "Order Date Unavailable"}
              </p>
            </div>

            <span
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase ${
                isTrackingLoading
                  ? "bg-gray-100 text-gray-300 border-gray-100 animate-pulse"
                  : getStatusColor(
                      trackData?.saleOrderStatusName || order.status,
                    )
              }`}
            >
              {isTrackingLoading
                ? "Loading..."
                : trackData?.saleOrderStatusName || order.status}
            </span>
          </div>
        </Motion.div>

        {/* Items Section */}
        <div className="mb-3 mt-3 pt-2">
          <h3 className="text-[16px] font-bold text-primary mb-2 ml-1">
            Order Items
          </h3>

          <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
            <div className="divide-y divide-gray-50">
              {order.items?.map((item, idx) => (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="py-3 first:pt-0 last:pb-0 flex items-center gap-2"
                >
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
                    <img
                      src={item.productImages?.[0]?.url}
                      alt={item.title}
                      className="rounded-xl max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-black text-primary truncate mb-0.5">
                      {item.title}
                    </h4>

                    <div className="text-[11px] text-gray-400 font-bold mb-0.5 flex flex-wrap items-center gap-1.5">
                      {item.variantAttributes && Object.keys(item.variantAttributes).length > 0
                        ? Object.entries(item.variantAttributes).map(([key, val], i, arr) => (
                            <span key={i} className="flex items-center gap-1.5">
                              {i > 0 && (
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                              )}
                              <span>{key}: {val}</span>
                            </span>
                          ))
                        : item.variantName}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-primary">
                        Rs. {Math.floor(Number(item.price)).toLocaleString()}
                      </span>

                      <span className="text-gray-400 text-[12px] font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-3">
          <h3 className="text-[16px] font-bold text-primary mb-2 ml-1">
            Order Summary
          </h3>

          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white space-y-3.5">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500 font-bold">
                Subtotal ({order.items?.length} Items)
              </span>

              <span className="text-gray-900 font-black">
                Rs. {Math.floor(subtotal).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500 font-bold">Shipping</span>
              {shipping === 0 ? (
                <span className="text-[#27AE60] font-black">FREE</span>
              ) : (
                <span className="text-gray-900 font-black">
                  Rs. {Math.floor(shipping).toLocaleString()}
                </span>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-400 font-bold">
                  Discount (WELCOME10)
                </span>
                <span className="text-rose-500 font-black">
                  - Rs. {discount}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[15px] font-black text-primary">Total</span>
              <span className="text-[18px] font-black text-primary">
                Rs. {Math.floor(total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div>
          <h3 className="text-[16px] font-bold text-primary mb-2 ml-1">
            Shipping Address
          </h3>
          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
            <h4 className="text-[14px] font-black text-primary mb-1.5">
              {order.address?.firstName} {order.address?.lastName}
            </h4>
            <div className="space-y-1">
              <p className="text-[12px] text-gray-600 font-bold leading-relaxed">
                {order.address?.address}
                {order.address?.city && `, ${order.address.city}`}
              </p>
              <p className="text-[12px] text-gray-600 font-bold mt-1">
                {order.address?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Track Order Button - Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-1001 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-4 transform transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              handleTrackOrder();
              vibrate(10);
            }}
            disabled={isTrackingLoading}
            className="w-full h-12 bg-primary text-white rounded-lg font-bold text-[15px] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isTrackingLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking Status...</span>
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsMobile;
