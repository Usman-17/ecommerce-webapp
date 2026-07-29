import { Shield } from "lucide-react";
import { motion as Motion } from "framer-motion";

const PrivacyHeader = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-[#CC0D39]/8 rounded-2xl flex items-center justify-center">
          <Shield size={26} className="text-[#CC0D39]" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-primary">
            Privacy Policy
          </h2>
          
          <p className="text-[11px] text-gray-500 font-bold mt-0.5">
            Last updated: January 1, 2026
          </p>
        </div>
      </div>

      <div className="bg-[#f9eded] sm:bg-[#fff7f7] rounded-xl p-5 border border-[#f5e0e0]/60">
        <p className="text-[13px] text-gray-700 font-bold leading-[1.8]">
          At <span className="text-primary font-black">Jemzy</span>, we value
          your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your data when you use our website and services.
        </p>
      </div>
    </Motion.div>
  );
};

export default PrivacyHeader;
