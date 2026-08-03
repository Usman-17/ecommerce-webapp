import { Headset } from "lucide-react";
// Imports End------

const CustomerCare = () => {
  return (
    <div className="mx-3 mt-2.5">
      <div className="bg-white rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E14A5C]/10 flex items-center justify-center text-[#E14A5C]">
            <Headset size={26} strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-[17px] font-black text-gray-900 leading-tight tracking-tight">
              Customer Care
            </h2>

            <p className="text-[12px] text-gray-400 font-medium mt-0.5">
              We're here to help you 24/7
            </p>
          </div>
        </div>

        <button className="bg-[#E14A5C]/5 text-[#E14A5C] text-[12px] font-bold px-4 py-2 rounded-lg active:scale-95 transition-transform">
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default CustomerCare;
