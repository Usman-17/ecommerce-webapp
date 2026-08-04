import { useState, useEffect } from "react";
import {
  Package,
  Heart,
  History,
  Star,
  Clock,
  TruckElectric,
  CircleCheckBig,
  ShieldCheck,
  Award,
  HelpCircle,
} from "lucide-react";

import { useUser } from "../../../hooks/useUser";
import { useWishlist } from "../../../hooks/useWishlist";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";

import DesktopWelcomeBanner from "./desktop/DesktopWelcomeBanner";
import DesktopStatsGrid from "./desktop/DesktopStatsGrid";
import DesktopOrderStatus from "./desktop/DesktopOrderStatus";
// Imports End-----

const DesktopProfileView = () => {
  const user = useUser();

  const { wishlist } = useWishlist();
  const { recentlyViewed } = useRecentlyViewed();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetch("/api/order/userorders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        setOrders(data?.orders || []);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const [reviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reviews")) || [];
    } catch {
      return [];
    }
  });

  const orderCounts = {
    Processing: orders.filter((o) => o.status?.toLowerCase() === "processing")
      .length,
    Shipped: orders.filter((o) => o.status?.toLowerCase() === "shipped").length,
    Delivered: orders.filter((o) => o.status?.toLowerCase() === "delivered")
      .length,
  };

  const stats = [
    {
      label: "Wishlist",
      count: wishlist.length,
      sub: "Saved items",
      icon: Heart,
      color: "text-[#E14A5C]",
      bg: "bg-[#E14A5C]/10",
      to: "/wishlist",
    },
    {
      label: "Recently Viewed",
      count: recentlyViewed.length,
      sub: "Items",
      icon: History,
      color: "text-[#3498DB]",
      bg: "bg-[#3498DB]/10",
    },
    {
      label: "Total Orders",
      count: orders.length,
      sub: "Orders placed",
      icon: Package,
      color: "text-[#27AE60]",
      bg: "bg-[#27AE60]/10",
      to: "/profile/orders",
    },
    {
      label: "Reviews",
      count: reviews.length,
      sub: "Reviews given",
      icon: Star,
      color: "text-[#F1C40F]",
      bg: "bg-[#F1C40F]/10",
    },
  ];

  const orderStatus = [
    {
      label: "Processing",
      sub: "Awaiting confirmation",
      icon: Clock,
      count: orderCounts.Processing,
      color: "text-[#E67E22]",
      bg: "bg-[#FEF3E2]",
      to: "/profile/orders?tab=Processing",
    },
    {
      label: "Shipped",
      sub: "On the way to you",
      icon: TruckElectric,
      count: orderCounts.Shipped,
      color: "text-[#3498DB]",
      bg: "bg-[#EBF5FB]",
      to: "/profile/orders?tab=Shipped",
    },
    {
      label: "Delivered",
      sub: "Successfully delivered",
      icon: CircleCheckBig,
      count: orderCounts.Delivered,
      color: "text-[#27AE60]",
      bg: "bg-[#EAFAF1]",
      to: "/profile/orders?tab=Delivered",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 space-y-4">
      <DesktopWelcomeBanner user={user} />

      <DesktopStatsGrid stats={stats} />

      <DesktopOrderStatus orderStatus={orderStatus} />

      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-1">
        {[
          {
            icon: ShieldCheck,
            label: "Secure & Safe",
            sub: "100% secure payments",
            color: "text-[#27AE60]",
            bg: "bg-[#27AE60]/10",
          },
          {
            icon: TruckElectric,
            label: "Fast Delivery",
            sub: "Quick & reliable shipping",
            color: "text-[#3498DB]",
            bg: "bg-[#3498DB]/10",
          },
          {
            icon: Award,
            label: "Premium Quality",
            sub: "Finest products always",
            color: "text-[#9B51E0]",
            bg: "bg-[#9B51E0]/10",
          },
          {
            icon: HelpCircle,
            label: "Customer Support",
            sub: "We're here to help",
            color: "text-[#E67E22]",
            bg: "bg-[#E67E22]/10",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
          >
            <div
              className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
            >
              <item.icon size={18} />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                {item.label}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopProfileView;
