import { MapPin, Navigation, Phone, ShieldCheck, Mail } from "lucide-react";

const SelfPickupInfo = ({ clientInfo }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header Section */}
      <div className="p-8 sm:p-10 text-center space-y-6 relative">
        <div className="w-20 h-20 rounded-[2.5rem] bg-accent/5 flex items-center justify-center mx-auto relative">
          <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full scale-75" />
          <MapPin className="text-accent relative z-10" size={40} />
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Self Pick-up
          </h3>

          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Collect your order directly from our official store. Your items will
            be professionally packed and{" "}
            <span className="text-accent font-black decoration-accent/20 underline decoration-2 underline-offset-4">
              ready within 30 minutes
            </span>{" "}
            after confirmation.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 max-w-xl mx-auto">
          {[
            { label: "READY IN", value: "30 Mins" },
            { label: "METHOD", value: "At Store" },
            { label: "STORE HOURS", value: "10AM - 10PM" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                {stat.label}
              </p>
              <p className="text-sm font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-50" />

      {/* Footer Section */}
      <div className="bg-gray-50/50 p-8 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-black text-gray-900">
                {clientInfo?.clientName || "ShopEase Official Store"}
              </h4>
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-full uppercase border border-accent/20">
                Official Store
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5 text-gray-500">
                <MapPin size={16} className="mt-0.5 text-accent" />
                <p className="text-xs font-bold leading-relaxed text-gray-700">
                  {clientInfo?.businessAddress ||
                    "123, Main Boulevard, Gulberg III, Lahore, Pakistan"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Phone size={16} className="text-accent" />
                  <p className="text-xs font-bold text-gray-900">
                    {clientInfo?.cellNo || "042-1234567"}
                  </p>
                </div>

                {clientInfo?.email && (
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <Mail size={16} className="text-accent" />
                    <p className="text-xs font-bold text-gray-600 italic">
                      {clientInfo.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
          >
            <Navigation size={16} />
            Get Directions
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-xl">
          <ShieldCheck className="text-accent" size={20} />
          <p className="text-[11px] font-bold text-gray-600">
            Please bring your order confirmation (SMS/Email) while visiting the
            store.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfPickupInfo;
