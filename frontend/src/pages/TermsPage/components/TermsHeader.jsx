import { FileText } from "lucide-react";
import { motion as Motion } from "framer-motion";

import termsImage from "../../../assets/terms.webp";

const TermsHeader = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-white to-[#fff8f5] rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f5e0e0]/40 relative overflow-hidden mb-4"
    >
      {/* Background Decorative Circle */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#CC0D39]/5 rounded-full blur-2xl" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-14 sm:h-14 bg-linear-to-br from-[#CC0D39] to-[#a00b2e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#CC0D39]/20">
            <FileText size={28} className="text-white" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
              Terms & Conditions
            </h2>

            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-[#CC0D39] rounded-full animate-pulse" />
              <p className="text-[11px] text-gray-500 font-bold">
                Last updated: July 1, 2026
              </p>
            </div>
          </div>
        </div>

        <img
          src={termsImage}
          alt="Terms & Conditions"
          className="hidden sm:block w-24 lg:w-32 h-auto object-contain drop-shadow-lg"
        />
      </div>

      <div className="bg-linear-to-r from-[#fff5f5] to-[#fffafa] rounded-xl p-5 border border-[#f5e0e0]/50 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#CC0D39]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[#CC0D39] text-sm">✓</span>
          </div>
          <p className="text-[13px] text-gray-700 font-bold leading-[1.8]">
            Welcome to <span className="text-primary font-black">Jemzy</span>.
            These Terms & Conditions govern your use of our website and
            services. By accessing or using our platform, you agree to comply
            with these terms.
          </p>
        </div>
      </div>
    </Motion.div>
  );
};

export default TermsHeader;
