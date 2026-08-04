import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  TruckElectric,
  CircleCheckBig,
  Locate,
  ChevronRight,
} from "lucide-react";

import { useUser } from "../../../../hooks/useUser";
// Imports End-----

const OrderTracker = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/order/userorders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => setOrders(data?.orders || []))
      .catch(() => setOrders([]));
  }, [user]);

  const counts = {
    Processing: orders.filter((o) => o.status?.toLowerCase() === "processing")
      .length,
    Shipped: orders.filter((o) => o.status?.toLowerCase() === "shipped").length,
    Delivered: orders.filter((o) => o.status?.toLowerCase() === "delivered")
      .length,
  };

  const statusItems = [
    {
      label: "Processing",
      sublabel: "Orders pending",
      icon: Clock,
      to: "/profile/orders?tab=Processing",
      color: "text-[#E67E22]",
      bg: "bg-[#FEF3E2]",
      borderColor: "border-[#E67E22]/20",
      count: counts.Processing,
      requiresAuth: true,
    },
    {
      label: "Shipped",
      sublabel: "In transit",
      icon: TruckElectric,
      to: "/profile/orders?tab=Shipped",
      color: "text-[#3498DB]",
      bg: "bg-[#EBF5FB]",
      borderColor: "border-[#3498DB]/20",
      count: counts.Shipped,
      requiresAuth: true,
    },
    {
      label: "Delivered",
      sublabel: "Completed",
      icon: CircleCheckBig,
      to: "/profile/orders?tab=Delivered",
      color: "text-[#27AE60]",
      bg: "bg-[#EAFAF1]",
      borderColor: "border-[#27AE60]/20",
      count: counts.Delivered,
      requiresAuth: true,
    },
  ];

  const handleItemClick = (to, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate("/login");
    } else {
      navigate(to);
    }
  };

  return (
    <div className="mx-3 mt-2.5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[15px] font-black text-gray-900 tracking-tight">
              Order Status
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Track your orders
            </p>
          </div>
          
          <button
            onClick={() => handleItemClick("/profile/orders", true)}
            className="flex items-center gap-1 text-[12px] font-bold text-accent hover:text-accent/80 transition-colors"
          >
            View All
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2.5">
        {statusItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item.to, item.requiresAuth)}
            className={`relative flex flex-col items-center text-center p-3 rounded-xl ${item.bg} border ${item.borderColor} group hover:shadow-md transition-all duration-300 active:scale-[0.97]`}
          >
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110`}
            >
              <item.icon size={20} strokeWidth={2.2} />
            </div>

            {/* Count */}
            <span className={`text-xl font-black ${item.color} leading-none`}>
              {item.count}
            </span>

            {/* Label */}
            <span className="text-[10px] font-bold text-gray-500 mt-1 leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Track Order CTA */}
      <div className="px-4 pb-4">
        <Link
          to="/track-order"
          className="flex items-center justify-between p-3.5 rounded-xl bg-linear-to-r from-[#9B51E0]/5 to-[#9B51E0]/10 border border-[#9B51E0]/15 group hover:from-[#9B51E0]/10 hover:to-[#9B51E0]/15 transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9B51E0]/10 flex items-center justify-center">
              <Locate size={18} className="text-[#9B51E0]" strokeWidth={2.2} />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-900 block leading-tight">
                Track Order
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                Real-time updates
              </span>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-gray-300 group-hover:text-[#9B51E0] group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      </div>
    </div>
  );
};

export default OrderTracker;
