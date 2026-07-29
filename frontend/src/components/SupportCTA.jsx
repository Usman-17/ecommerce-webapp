import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const SupportCTA = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block sm:hidden w-full bg-[#fff5f5] border border-red-100 rounded-xl p-5 sm:p-8 flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-sm"
    >
      {/* Illustration Circle */}
      <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-inner flex items-center justify-center p-4 mx-auto sm:mx-0">
        <div className="relative w-full h-full">
          <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
            {/* Head */}
            <circle cx="36" cy="36" r="14" fill="#fca5a5" opacity="0.3" />
            <circle cx="36" cy="36" r="10" fill="#fee2e2" />

            {/* Headphones */}
            <path
              d="M22 36 C22 22 50 22 50 36"
              stroke="#dc2626"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="18" y="34" width="8" height="12" rx="4" fill="#dc2626" />
            <rect x="46" y="34" width="8" height="12" rx="4" fill="#dc2626" />

            {/* Chat Bubble Icon */}
            <rect x="40" y="16" width="20" height="14" rx="5" fill="#f43f5e" />
            <circle cx="45" cy="23" r="1.2" fill="white" />
            <circle cx="50" cy="23" r="1.2" fill="white" />
            <circle cx="55" cy="23" r="1.2" fill="white" />
            <path d="M43 30 L41 34 L48 30Z" fill="#f43f5e" />
          </svg>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 text-center sm:text-left mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md">
          We&apos;re here to help! Our support team is ready to assist you
          anytime.
        </p>
      </div>

      {/* Button */}
      <Link
        to="/contact-us"
        className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-red-200 active:scale-95 whitespace-nowrap"
      >
        <Mail size={18} strokeWidth={2} />
        Contact Us
      </Link>
    </Motion.div>
  );
};

export default SupportCTA;
