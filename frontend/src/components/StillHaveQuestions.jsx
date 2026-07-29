import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
// Imports End-----

const StillHaveQuestions = ({ className = "" }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className={` hidden lg:block lg:w-72 shrink-0 rounded-2xl border border-red-100 overflow-hidden text-center ${className}`}
    style={{
      background: "linear-gradient(160deg, #fff5f5 0%, #fee2e2 100%)",
    }}
  >
    {/* Illustration Area */}
    <div
      className="flex items-center justify-center pt-6 pb-2"
      style={{ background: "rgba(220,38,38,0.06)" }}
    >
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        {/* Head */}
        <circle cx="36" cy="26" r="13" fill="#fca5a5" />
        <circle cx="36" cy="26" r="9" fill="#fee2e2" />
        {/* Headset band */}
        <path
          d="M23 26 C23 14 49 14 49 26"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Ear cups */}
        <rect x="19" y="24" width="7" height="10" rx="3.5" fill="#dc2626" />
        <rect x="46" y="24" width="7" height="10" rx="3.5" fill="#dc2626" />
        {/* Mic */}
        <path
          d="M53 30 Q58 30 58 36"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="58" cy="37" r="2" fill="#dc2626" />
        {/* Chat bubble */}
        <rect x="38" y="10" width="18" height="12" rx="4" fill="#dc2626" />
        <circle cx="43" cy="16" r="1.5" fill="white" />
        <circle cx="47" cy="16" r="1.5" fill="white" />
        <circle cx="51" cy="16" r="1.5" fill="white" />
        <path d="M41 22 L39 26 L45 22Z" fill="#dc2626" />
      </svg>
    </div>

    {/* Text */}
    <div className="px-5 pt-3 pb-5">
      <h4 className="text-base font-bold text-gray-900 mb-1">
        Still have questions?
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        We&apos;re here to help! Our support team is ready to assist you
        anytime.
      </p>

      {/* Button */}
      <Link
        to="/contact-us"
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
        style={{ background: "linear-gradient(90deg, #dc2626, #ef4444)" }}
      >
        {/* Envelope icon */}
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
          <rect
            x="2"
            y="5"
            width="16"
            height="11"
            rx="2"
            stroke="white"
            strokeWidth="1.8"
          />
          <path
            d="M2 7l8 5 8-5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Contact Us
      </Link>
    </div>
  </Motion.div>
);

export default StillHaveQuestions;
