import { useState } from "react";
import { Link } from "react-router-dom";
import LottieComponent from "lottie-react";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  Phone,
  Copy,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import congratsAnimation from "../../../assets/lottie/successfulCheck.json";
import { CONTACT_INFO } from "../../../constants/social";
// Imports End------

const Lottie = LottieComponent?.default || LottieComponent;

const SuccessModal = ({
  isSuccess,
  navigate,
  savedOrderResponse,
  userName,
  estimatedArrival,
  total,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isSuccess) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      <div
        onClick={() => navigate("/")}
        className="absolute inset-0 bg-gray-900/80 animate-[fadeIn_0.15s_ease-out]"
      />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 flex flex-col max-h-[95vh] animate-[scaleIn_0.2s_ease-out]">
        <div className="p-4 sm:p-10 text-center overflow-y-auto no-scrollbar">
          {/* Lottie Animation */}
          <div className="relative w-32 h-32 mx-auto -mt-10 sm:-mt-14 mb-0">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full scale-75" />
            <Lottie
              animationData={congratsAnimation}
              loop={false}
              className="w-full h-full relative z-10"
            />
          </div>

          <div className="space-y-1 mb-6 -mt-6">
            <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tighter leading-none">
              Order <span className="text-accent">Success!</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed text-xs sm:text-sm">
              Thank you,{" "}
              <span className="text-primary font-bold">{userName}</span>! Your
              order is being processed.
            </p>
          </div>

          {/* Order ID and Expected By Section */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-pink-50/40 border border-accent/5 rounded-xl p-3 text-left">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Order ID
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-black text-primary truncate">
                  #{savedOrderResponse?.trackingNo}
                </span>

                <button
                  onClick={() =>
                    copyToClipboard(savedOrderResponse?.trackingNo)
                  }
                  className="text-accent hover:bg-white p-1 rounded-md transition-colors"
                >
                  {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-left">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                Expected By
              </span>

              <div className="flex items-center gap-1.5">
                <Truck size={12} className="text-accent" />
                <span className="text-[12px] font-black text-primary">
                  {estimatedArrival}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm text-left space-y-3">
            {/* Order and Payment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={14} className="text-primary" />
                </div>

                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                    Payment
                  </span>
                  <span className="text-[11px] font-bold text-primary truncate block">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Truck size={14} className="text-primary" />
                </div>

                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                    Shipping
                  </span>
                  <span className="text-[11px] font-bold text-primary truncate block">
                    Home Delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px border-t border-dashed border-gray-100" />

            {/* Order and Payment Status Section */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                  Payment Status
                </span>
                <span className="text-[9px] font-black text-accent bg-pink-50 px-2 py-0.5 rounded-full uppercase inline-block mt-0.5">
                  Unpaid (COD)
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-gray-400">
                  Amount Paid
                </span>
                <div className="text-2xl font-black text-primary leading-none mt-1">
                  <span className="text-xs font-bold text-accent mr-0.5">
                    Rs.
                  </span>
                  {Math.floor(total).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Track Order Button & Shop More Button */}
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Link
              to={`/track-order?id=${savedOrderResponse?.id || ""}`}
              className="flex-[1.2] group bg-accent hover:bg-[#c93d4f] text-white py-3.5 rounded-lg font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-pink-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Track Order</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <button
              onClick={() => navigate("/shop")}
              className="flex-1 bg-primary hover:bg-black text-white py-3.5 rounded-lg font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Shop More</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 opacity-40">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-1.5 opacity-40">
              <Phone size={12} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {CONTACT_INFO.phone}
              </span>
            </div>

            <div className="flex items-center gap-1.5 opacity-40">
              <ExternalLink size={12} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Policies
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
