import moment from "moment";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  Package,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  Calendar,
  XCircle,
  ShieldCheck,
  RefreshCcw,
  Truck,
  HeadphonesIcon,
  CheckCircle2,
  Clock,
  Mail,
} from "lucide-react";

import { CONTACT_INFO } from "../../../constants/social";
// Imports End----

const TRACKING_STEPS = [
  { label: "Order Placed", icon: Package },
  { label: "Processing", icon: RefreshCcw },
  { label: "Shipped", icon: Truck },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const STATUS_ORDER = [
  "pending",
  "processing",
  "shipped",
  "out for delivery",
  "delivered",
];

const OrderDetailsDesktop = ({
  order,
  getStatusColor,
  isTrackingLoading,
  trackData,
  handleTrackOrder,
}) => {
  const navigate = useNavigate();

  if (!order) return null;

  const total =
    (Number(order.amount) || 0) + (Number(order.shippingCharge) || 0);
  const subtotal =
    order.items?.reduce(
      (acc, item) =>
        acc + Number(item.price || 0) * (Number(item.quantity) || 1),
      0,
    ) || 0;
  const shipping = order.shippingCharge || 0;
  const discount = 0;

  const currentStatus = (
    trackData?.saleOrderStatusName ||
    order.status ||
    "pending"
  ).toLowerCase();
  const currentStepIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="hidden md:block pt-4 pb-6">
      {/* Page Header */}
      <div className="mb-6">
        <nav className="text-[12px] text-gray-400 font-medium mb-3 flex items-center gap-1.5">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/profile/orders")}
            className="hover:text-primary transition-colors"
          >
            My Orders
          </button>
          <span>›</span>
          <span className="text-primary font-bold">Order Details</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight mb-1">
              Order Details
            </h1>

            <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium">
              <span>
                Order ID:{" "}
                <span className="text-primary font-bold">
                  #{order.trackingNo}
                </span>
              </span>

              <span className="text-gray-200">|</span>

              <span>
                Placed on{" "}
                {moment(order.date).isValid()
                  ? moment(order.date).format("MMM DD, YYYY [at] hh:mm A")
                  : "Date Unavailable"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`text-[10px] font-bold px-5 py-1.5 rounded-full border uppercase tracking-widest ${
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

            {isTrackingLoading && (
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 animate-pulse">
                <div className="w-2 h-2 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                Updating Status...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8 space-y-5">
          {/* Order Items Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-[15px] font-bold text-primary">
                Order Items ({order.items?.length})
              </h3>
            </div>

            <div className="px-6 divide-y divide-gray-50">
              {/* Column Headers */}
              <div className="grid grid-cols-12 gap-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {order.items?.map((item, idx) => (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-12 gap-4 py-4 items-center"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 p-1.5 border border-gray-50 flex items-center justify-center">
                      <img
                        src={item.productImages?.[0]?.url}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-primary truncate mb-0.5">
                        {item.title}
                      </h4>

                      {item.variantAttributes &&
                        Object.keys(item.variantAttributes).length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            {Object.entries(item.variantAttributes).map(
                              ([key, val], vIdx, arr) => (
                                <div
                                  key={vIdx}
                                  className="flex items-center gap-1.5"
                                >
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {key}: {val}
                                  </span>

                                  {vIdx < arr.length - 1 && (
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      <p className="text-[13px] font-bold text-primary mt-1">
                        Rs. {Math.floor(Number(item.price)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 text-center">
                    <span className="text-[13px] font-bold text-gray-600">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="text-[14px] font-bold text-primary">
                      Rs.{" "}
                      {Math.floor(
                        Number(item.price) * item.quantity,
                      ).toLocaleString()}
                    </span>
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>

          {/* Order Tracking Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-bold text-primary mb-6">
              Order Tracking
            </h3>

            <div className="flex items-start justify-between relative">
              {TRACKING_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isLast = idx === TRACKING_STEPS.length - 1;

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 z-10 relative flex-1"
                  >
                    {/* Connector line */}
                    {!isLast && (
                      <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-100 z-0">
                        <div
                          className="h-full bg-primary transition-all duration-700"
                          style={{
                            width: idx < currentStepIndex ? "100%" : "0%",
                          }}
                        />
                      </div>
                    )}

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                        isCurrent
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                          : isDone
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      className={`text-[11px] font-bold text-center leading-tight ${isCurrent ? "text-primary" : isDone ? "text-gray-500" : "text-gray-300"}`}
                    >
                      {step.label}
                    </span>

                    {isCurrent && order.date && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        {moment(order.date).format("MMM DD, YYYY")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping & Payment Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-bold text-primary mb-5">
              Shipping & Payment Information
            </h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <p className="text-[12px] font-semibold text-gray-500 uppercase mt-0.5">
                    Shipping Address
                  </p>
                </div>

                <div className="space-y-0.5 text-[13px] text-gray-600 font-medium leading-relaxed">
                  <p className="font-bold text-primary">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>

                  <p>{order.address?.address}</p>
                  {order.address?.city && <p>{order.address.city}</p>}
                </div>

                {order.address?.phone && (
                  <div className="flex items-center gap-2 mt-2">
                    <Phone size={13} className="text-gray-400" />
                    <span className="text-[12px] text-gray-500 font-medium">
                      {order.address.phone}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 mb-1">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    Delivery Date (Estimated)
                  </p>
                </div>

                <p className="text-[13px] text-gray-600 font-medium">
                  {moment(order.date).add(5, "days").format("MMM DD")} -{" "}
                  {moment(order.date).add(7, "days").format("MMM DD, YYYY")}
                </p>
              </div>

              {/* Payment & Notes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={16} className="text-gray-400" />
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </p>
                </div>

                <p className="text-[13px] font-bold text-primary">
                  Cash on Delivery
                </p>

                <div className="flex items-center gap-2 mt-5 mb-3">
                  <FileText size={16} className="text-gray-400" />
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    Order Notes
                  </p>
                </div>

                <p className="text-[13px] text-gray-400 font-medium italic">
                  No notes added
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-5">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-bold text-primary mb-5">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal ({order.items?.length}{" "}
                  {order.items?.length === 1 ? "Item" : "Items"})
                </span>
                <span className="font-bold text-primary">
                  Rs. {Math.floor(subtotal).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Charges</span>
                <span className="font-bold text-primary">Rs. {shipping}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="font-bold text-primary">- Rs. {discount}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[15px] font-black text-primary">
                  Total Amount
                </span>

                <span className="text-[20px] font-black text-primary">
                  <span className="text-[13px] mr-1 font-bold">Rs.</span>
                  {Math.floor(total).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-emerald-500 font-bold mt-3">
              You saved Rs. {discount} on this order
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-bold text-primary mb-4">Actions</h3>

            <div className="space-y-3">
              {[
                {
                  Icon: Truck,
                  label: "Track Details",
                  action: isTrackingLoading ? "Checking..." : "View Info",
                  color: "text-indigo-500",
                  onClick: handleTrackOrder,
                  disabled: isTrackingLoading,
                },
                {
                  Icon: XCircle,
                  label: "Cancel Order",
                  action: "Cancel",
                  color: "text-rose-500",
                },
              ].map(
                ({ Icon, label, action, color, onClick, disabled }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={color} />
                      <span className="text-[13px] font-bold text-gray-600">
                        {label}
                      </span>
                    </div>

                    <button
                      onClick={onClick}
                      disabled={disabled}
                      className={`w-24 h-8 rounded border font-bold text-[12px] transition-all active:scale-[0.96] disabled:opacity-50 ${
                        color.includes("rose")
                          ? "border-rose-200 text-rose-500 hover:bg-rose-50"
                          : "border-indigo-200 text-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {action}
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-bold text-primary mb-2">
              Need Help?
            </h3>
            <p className="text-[12px] text-gray-400 font-medium mb-4 max-w-80">
              If you have any questions about your order, feel free to contact
              us.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                <Phone size={15} className="text-gray-500 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                <Mail size={15} className="text-gray-500 shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                <Clock size={15} className="text-gray-500 shrink-0" />
                <span>24/7 Customer Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip - Full Width */}
      <div className="mt-6 bg-rose-100/70 rounded-xl p-7 border border-rose-100/90 grid grid-cols-4 gap-4">
        {[
          {
            Icon: ShieldCheck,
            title: "Secure Payment",
            desc: "Your payments are safe with us.",
          },
          {
            Icon: RefreshCcw,
            title: "Easy Returns",
            desc: "Hassle-free returns within 7 days.",
          },
          {
            Icon: Truck,
            title: "Fast Delivery",
            desc: "Quick delivery to your doorstep.",
          },
          {
            Icon: HeadphonesIcon,
            title: "Customer Support",
            desc: "We're here to help anytime.",
          },
        ].map(({ Icon, title, desc }, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Icon size={22} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-bold text-primary mb-0.5">
                {title}
              </p>
              <p className="text-[11px] text-gray-400 font-medium leading-tight">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailsDesktop;
