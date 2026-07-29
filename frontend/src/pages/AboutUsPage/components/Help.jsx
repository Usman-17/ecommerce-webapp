import { Mail } from "lucide-react";
import headsetImage from "../../../assets/about-us/headset.png";

const Help = () => {
  return (
    <section className="relative overflow-hidden rounded-xl border border-accent/10 bg-accent/5 px-6 py-12 md:py-20 lg:py-24">
      {/* Background Decorations */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 grid-cols-3 gap-3 md:grid lg:left-10">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-accent/30" />
        ))}
      </div>

      <div className="absolute right-8 top-1/2 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-accent/10 md:flex lg:right-12">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent/60" />
        </div>
      </div>

      {/* Headset Image - Standard flow on mobile, Absolute left on desktop */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-0 hidden -translate-y-1/2 lg:block xl:left-[2%]">
        <div className="relative flex flex-col items-center">
          <img
            src={headsetImage}
            alt="Support Headset"
            className="relative z-10 w-full max-w-70 object-contain transition-transform duration-500 hover:-translate-y-2 xl:max-w-105"
          />
          {/* Floor Shadow */}
          <div className="absolute bottom-2 z-0 h-4 w-[50%] rounded-[50%] bg-black/20 blur-md xl:h-6 xl:blur-lg" />
        </div>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Headset Image for Mobile/Tablet */}
        <div className="mb-10 flex w-full max-w-70 flex-col items-center sm:max-w-90 lg:hidden">
          <div className="relative flex flex-col items-center">
            <img
              src={headsetImage}
              alt="Support Headset"
              className="relative z-10 w-full object-contain"
            />
            {/* Floor Shadow */}
            <div className="absolute -bottom-1 z-0 h-3 w-[50%] rounded-[50%] bg-black/20 blur-md sm:h-4 sm:blur-md" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-accent shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Need Help?
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-5xl">
          We're Here to <span className="text-accent">Help You</span>
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-120 text-base leading-relaxed text-gray-500 md:text-lg">
          Our support team is always ready to assist you with any questions or
          concerns.
        </p>

        {/* Button */}
        <button className="mt-10 flex items-center gap-3 rounded-lg bg-accent px-8 py-3 text-lg font-bold text-white shadow-sm shadow-accent/20 transition-all duration-300 hover:shadow-sm hover:shadow-accent/30">
          <Mail size={22} />
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Help;
