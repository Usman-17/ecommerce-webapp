import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ReceiptText, Star, History } from "lucide-react";

import { useUser } from "../../../../hooks/useUser";
import { useWishlist } from "../../../../hooks/useWishlist";
import { useRecentlyViewed } from "../../../../hooks/useRecentlyViewed";
// Imports End-----

const QuickLinks = () => {
  const navigate = useNavigate();

  const user = useUser();
  const { wishlist } = useWishlist();
  const { recentlyViewed } = useRecentlyViewed();

  // Orders
  const [orders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      return [];
    }
  });

  // Reviews
  const [reviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reviews")) || [];
    } catch {
      return [];
    }
  });

  const counts = {
    "/wishlist": wishlist.length,
    "/recently-viewed": recentlyViewed.length,
    "/profile/orders": orders.length,
    "/reviews": reviews.length,
  };

  const links = [
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: Heart,
      color: "text-[#E14A5C]",
      bg: "bg-[#E14A5C]/10",
      badgeBg: "bg-[#E14A5C]",
    },
    {
      to: "/recently-viewed",
      label: "Recent",
      icon: History,
      color: "text-[#3498DB]",
      bg: "bg-[#3498DB]/10",
      badgeBg: "bg-[#3498DB]",
    },
    {
      to: "/profile/orders",
      label: "History",
      icon: ReceiptText,
      color: "text-[#27AE60]",
      bg: "bg-[#27AE60]/10",
      badgeBg: "bg-[#27AE60]",
      requiresAuth: true,
    },
    {
      to: "/reviews",
      label: "Reviews",
      icon: Star,
      color: "text-[#F1C40F]",
      bg: "bg-[#F1C40F]/10",
      badgeBg: "bg-[#F1C40F]",
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
    <div className="bg-white rounded-xl mx-3 mt-2 py-4 px-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="flex items-center justify-between gap-1">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center flex-1">
            <button
              onClick={() => handleItemClick(link.to, link.requiresAuth)}
              className="flex flex-col items-center gap-2.5 group flex-1 active:scale-[0.95] transition-transform duration-200"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 relative`}
              >
                <link.icon
                  size={22}
                  strokeWidth={2}
                  className="relative z-10"
                />

                {counts[link.to] > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full ${link.badgeBg} text-white text-[10px] font-bold z-20 px-1`}
                  >
                    {counts[link.to]}
                  </span>
                )}

                {/* Decorative background shape */}
                <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-white/60 blur-lg transition-transform group-hover:scale-150"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors tracking-tight text-center leading-tight">
                {link.label}
              </span>
            </button>

            {idx < links.length - 1 && (
              <div className="h-12 w-px bg-gray-100/80 mx-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
