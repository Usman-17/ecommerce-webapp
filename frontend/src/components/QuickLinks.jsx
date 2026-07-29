import { Link } from "react-router-dom";
import {
  BadgeInfo,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  TruckElectric,
} from "lucide-react";
// Imports End---------

const QuickLinks = ({ activeLabel = "Track Your Order" }) => {
  const sidebarLinks = [
    { label: "About Us", path: "/about-us", icon: <BadgeInfo size={18} /> },
    {
      label: "Contact Us",
      path: "/contact-us",
      icon: <MessageCircle size={18} />,
    },
    {
      label: "Track Your Order",
      path: "/track-order",
      icon: <TruckElectric size={18} />,
    },
    {
      label: "Returns & FAQs",
      path: "/faqs",
      icon: <RotateCcw size={18} />,
    },
    {
      label: "Shipping Policy",
      path: "/shipping-policy",
      icon: <ShieldCheck size={18} />,
    },
  ];

  return (
    <aside className="hidden sm:block w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-xl p-2 py-2 shadow-xs border border-white flex flex-col gap-1">
        {sidebarLinks.map((link, index) => {
          const isActive = link.label === activeLabel;
          return (
            <Link
              key={index}
              to={link.path}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "text-accent bg-accent/5"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default QuickLinks;
