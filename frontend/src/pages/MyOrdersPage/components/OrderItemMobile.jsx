import moment from "moment";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
// Imports End----

const OrderItemMobile = ({ order, getStatusColor }) => {
  return (
    <div className="md:hidden bg-white rounded-xl p-5 border border-[#F1E4D8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 mb-2.5">
      {/* Top Section: Order# and Status */}
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="text-[15px] font-black text-primary tracking-tight">
          Order #{order.trackingNo}
        </h3>

        <span
          className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Date and Item Count */}
      <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold mb-3">
        <span>{moment(order.date).format("MMM DD, YYYY")}</span>
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <span>
          {order.items?.length}{" "}
          {order.items?.length === 1 ? "Product" : "Products"}
        </span>
      </div>

      {/* Images and Price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex -space-x-2 overflow-hidden">
          {order.items?.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0"
            >
              <img
                src={item.productImages?.[0]?.url}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          ))}

          {order.items?.length > 3 && (
            <div className="w-14 h-14 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[11px] font-black text-gray-400 shrink-0">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-xl font-black text-primary leading-none">
            <span className="text-xs mr-0.5 tracking-normal">Rs.</span>
            {Math.floor(order.amount).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-end pt-4 border-t border-gray-100">
        <Link
          to={`/order-details?id=${order.trackingNo}`}
          className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-accent transition-colors uppercase active:scale-[0.96] active:opacity-70 touch-manipulation"
        >
          <span>View Details</span>
          <ChevronRight size={14} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
};

export default OrderItemMobile;
