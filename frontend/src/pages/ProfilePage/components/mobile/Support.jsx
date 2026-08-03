import { Link } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  BadgeInfo,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
// Imports End------

const Support = () => {
  const careItems = [
    {
      title: "Contact Us",
      description: "Chat with our support team",
      icon: MessageCircle,
      to: "/contact-us",
      color: "text-[#E91E63]",
      bg: "bg-[#FCE4EC]",
    },
    {
      title: "About Us",
      description: "Know more about us",
      icon: BadgeInfo,
      to: "/about-us",
      color: "text-[#7C3AED]",
      bg: "bg-[#EDE7F6]",
    },
    {
      title: "Returns & FAQs",
      description: "Easy 7-day returns",
      icon: RotateCcw,
      to: "/faqs",
      color: "text-[#FF9800]",
      bg: "bg-[#FFF8E1]",
    },
    {
      title: "Shipping Policy",
      description: "Our shipping policy",
      icon: ShieldCheck,
      to: "/shipping-policy",
      color: "text-[#4CAF50]",
      bg: "bg-[#E8F5E9]",
    },
  ];

  return (
    <div className="mx-3 mt-2.5">
      <div className="bg-white rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="text-[15px] font-black text-gray-900 leading-tight tracking-tight">
              Support
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Get help and find answers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {careItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center justify-between p-1 rounded-2xl active:scale-[0.98] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-all duration-500 border border-white`}
                >
                  <item.icon size={18} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-[14px] font-black text-gray-900 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <ChevronRight size={12} className="text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
