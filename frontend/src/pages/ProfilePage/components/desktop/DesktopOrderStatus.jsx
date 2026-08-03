import { Link } from "react-router-dom";
import { Locate, ChevronRight } from "lucide-react";
// Imports End-----

const DesktopOrderStatus = ({ orderStatus }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-black text-gray-900">Order Status</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Track your orders at a glance
          </p>
        </div>

        <Link
          to="/profile/orders"
          className="flex items-center gap-1 text-sm font-bold text-[#CC0D39] hover:text-[#B00C31] transition-colors"
        >
          View All Orders
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {orderStatus.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={`p-4 rounded-xl ${item.bg} border border-transparent hover:shadow-sm transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}
              >
                <item.icon size={20} />
              </div>
              <div>
                <span
                  className={`text-xl font-black ${item.color} leading-none block`}
                >
                  {item.count}
                </span>
                <span className="text-xs font-bold text-gray-600">
                  {item.label}
                </span>
                <p className="text-[10px] text-gray-400 font-medium">
                  {item.sub}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Track Order */}
      <div className="mt-5 p-4 bg-[#F8F5FF] rounded-xl border border-[#9B51E0]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9B51E0]/10 flex items-center justify-center">
              <Locate size={18} className="text-[#9B51E0]" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                Track Your Order
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                Get real-time delivery updates
              </span>
            </div>
          </div>
          <Link
            to="/track-order"
            className="px-4 py-2 bg-[#9B51E0] text-white text-sm font-bold rounded-lg hover:bg-[#8E44AD] transition-colors flex items-center gap-1"
          >
            Track Order
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopOrderStatus;
