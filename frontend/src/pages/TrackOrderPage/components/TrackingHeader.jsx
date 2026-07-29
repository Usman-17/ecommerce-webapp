import { motion as Motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import orderTrackingBg from "../../../assets/order-tracking-bg.webp";

const TrackingHeader = ({
  orderNumberInput,
  setOrderNumberInput,
  handleTrack,
  isLoading,
  isError,
  queryError,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-143 flex items-center justify-center p-8 sm:p-0 mt-2 sm:mt-0">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={orderTrackingBg}
          alt="Order Tracking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#5B42F3]/70 to-[#9137FC]/70 mix-blend-multiply"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-3xl text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight">
          Order tracking
        </h2>

        <p className="text-[13px] sm:text-base text-white/90 mb-10 leading-relaxed max-w-lg mx-auto">
          To track your order please enter your Order ID in the box below and
          press the 'Track' button. This was given to you on your receipt and in
          the confirmation email you should have received.
        </p>

        {/* Form */}
        <form
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row items-end sm:gap-4 gap-2"
        >
          <div className="w-full text-left">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
              Order ID
            </label>

            <input
              type="text"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              placeholder="Found in your order confirmation email."
              className="w-full bg-white text-gray-800 h-10 px-5 rounded-full outline-none placeholder:text-xs focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-400 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-10 bg-[#FF4C5E] hover:bg-[#ff3549] text-white font-bold rounded-full shadow-lg shadow-[#FF4C5E]/20 transition-all shrink-0 uppercase tracking-widest text-xs focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 sm:mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search size={14} />
                Track
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {isError && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-[#FFBABA] text-xs font-bold flex items-center justify-center gap-2"
          >
            <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 shrink-0">
              !
            </span>
            {queryError?.message}
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackingHeader;
