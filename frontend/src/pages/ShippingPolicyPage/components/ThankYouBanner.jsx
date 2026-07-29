import { ShieldCheck } from "lucide-react";

const ThankYouBanner = () => {
  return (
    <div className="bg-[#fdefef] rounded-xl p-6 sm:p-8 border border-[#f5e0e0]/50">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <ShieldCheck size={24} className="text-[#CC0D39]" />
        </div>
        <p className="text-[13px] text-gray-600 font-bold leading-relaxed">
          We are committed to providing a smooth and reliable delivery
          experience.
        </p>
        <p className="text-[15px] font-black text-[#CC0D39]">
          Thank you for shopping with JEMZY! ❤️
        </p>
      </div>
    </div>
  );
};

export default ThankYouBanner;
