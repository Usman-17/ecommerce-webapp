import { ShieldCheck, Timer, Shield, Headset } from "lucide-react";

import send from "../../../assets/plain.png";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
// Imports End-----

const FormFooter = ({ formik, isPending }) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-6 py-2 sm:py-6 px-2">
      {/* Send Message Button */}
      <button
        disabled={isPending || formik?.isSubmitting}
        type="submit"
        className="flex items-center justify-center gap-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md shadow-rose-200 disabled:opacity-70 min-w-45"
      >
        {isPending ? (
          <LoadingSpinner
            content="Sending..."
            width="w-auto"
            iconColor="text-white"
            textColor="text-white"
          />
        ) : (
          <>
            <img src={send} alt="Send" className="size-5" />
            <span>Send Message</span>
          </>
        )}
      </button>

      {/* Privacy Note */}
      <div className="flex items-center gap-3 max-w-70">
        <ShieldCheck
          size={28}
          className="text-slate-400 shrink-0"
          strokeWidth={1.5}
        />

        <p className="text-slate-500 text-[13px] leading-tight">
          We value your privacy and will never share your information.
        </p>
      </div>

      {/* Features Icons */}
      <div className="flex items-center justify-center lg:justify-start gap-5 sm:gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 w-full lg:w-auto">
        {/* Quick Response */}
        <div className="flex flex-col items-center gap-2">
          <Timer size={24} className="text-slate-600" strokeWidth={1.5} />
          <span className="text-slate-700 text-[12px] font-medium whitespace-nowrap">
            Quick Response
          </span>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

        {/* Secure & Safe */}
        <div className="flex flex-col items-center gap-2">
          <Shield size={24} className="text-slate-600" strokeWidth={1.5} />
          <span className="text-slate-700 text-[12px] font-medium whitespace-nowrap">
            Secure & Safe
          </span>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

        {/* 24/7 Support */}
        <div className="flex flex-col items-center gap-2">
          <Headset size={24} className="text-slate-600" strokeWidth={1.5} />
          <span className="text-slate-700 text-[12px] font-medium whitespace-nowrap">
            24/7 Support
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormFooter;
