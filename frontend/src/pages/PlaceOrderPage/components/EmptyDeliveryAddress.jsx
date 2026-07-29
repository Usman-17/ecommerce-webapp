import { motion as Motion } from "framer-motion";
import { Redo, ShieldCheck, Clock, Package } from "lucide-react";

import deliveryImage from "../../../assets/place-order/delivery-address.webp";
// Imports End-----

const EmptyDeliveryAddress = ({ setIsChangingAddress }) => {
  return (
    <Motion.div
      key="empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center pb-2 px-4 text-center w-full"
    >
      <div className="relative mb-6">
        <img
          src={deliveryImage}
          alt="Delivery Address"
          className="w-48 h-auto object-contain mx-auto"
        />
      </div>

      <h3 className="text-[20px] sm:text-[24px] font-black text-[#1e293b] mb-3">
        No delivery address added yet
      </h3>
      <p className="text-[#64748b] text-[14px] sm:text-[15px] font-medium max-w-75 sm:max-w-sm mb-8 leading-relaxed">
        Add a delivery address to place your order and enjoy seamless delivery
      </p>

      {/* Add Address Button */}
      <button
        type="button"
        onClick={() => setIsChangingAddress(true)}
        className="flex items-center gap-2 px-8 py-3.5 bg-[#FF4D6D] text-white rounded-full font-bold shadow-lg shadow-[#FF4D6D]/30 hover:bg-[#FF4D6D]/80 active:translate-y-0 transition-all text-[12px]"
      >
        <Redo className="w-5 h-5" strokeWidth={2.5} />
        Add Address
      </button>

      {/* Bottom Features */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-8 sm:gap-4 mt-16 sm:mt-10 w-full max-w-3xl pt-2 sm:pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F7] flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#FF4D6D]" strokeWidth={2.5} />
          </div>
          <h4 className="text-[13px] font-black text-[#1e293b] mb-1">
            Safe & Secure
          </h4>
          <p className="text-[11px] text-[#94a3b8] font-medium leading-relaxed">
            Your information is protected
          </p>
        </div>

        <div className="flex flex-col items-center text-center sm:border-x sm:border-gray-100 px-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F7] flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-accent" strokeWidth={2.5} />
          </div>
          <h4 className="text-[13px] font-black text-[#1e293b] mb-1">
            Faster Delivery
          </h4>

          <p className="text-[11px] text-[#94a3b8] font-medium leading-relaxed">
            Quick and reliable shipping
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F7] flex items-center justify-center mb-4">
            <Package className="w-5 h-5 text-[#FF4D6D]" strokeWidth={2.5} />
          </div>

          <h4 className="text-[13px] font-black text-[#1e293b] mb-1">
            Hassle-Free
          </h4>
          <p className="text-[11px] text-[#94a3b8] font-medium leading-relaxed">
            Smooth and easy experience
          </p>
        </div>
      </div>
    </Motion.div>
  );
};

export default EmptyDeliveryAddress;
