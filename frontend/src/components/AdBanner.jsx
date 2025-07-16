import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import banner from "../assets/banner_1.webp";

const AdBanner = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-10 pb-20 sm:py-20 lg:px-32 gap-8 sm:gap-10 overflow-hidden">
      {/* Text Content */}
      <div className="text-center sm:text-left max-w-xl animate-fade-in-up">
        <p className="uppercase tracking-wide text-sm text-gray-500 font-medium mb-1">
          Most Demanded Necklace
        </p>

        <h1 className="text-2xl md:text-4xl lg:text-3xl font-semibold text-gray-900 leading-tight mb-3">
          The Wait Is Over!{" "}
          <span className="text-[#CC0D39]">Most Wanted Necklace</span> Restocked
          — <span className="text-[#CC0D39]">Limited Time Sale</span> On Now
        </h1>

        <p className="text-gray-600 text-base md:text-lg mb-4">
          Back by demand — our best-selling necklace is restocked and on sale!
          Limited stock, so grab yours now before it’s gone again.
        </p>

        <Link to="/collection">
          <button className="mt-4 inline-flex items-center gap-2 bg-[#CC0D39] hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 hover:shadow-red-500/50 animate-pulse shake-on-hover">
            Claim Now
            <PartyPopper className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Product Image with Star */}
      <div className="relative flex justify-center animate-float">
        <img
          src={banner}
          alt="Jemzy Featured Product"
          className="w-[260px] sm:w-[250px] md:w-[360px] lg:w-[360px] rounded-[350px] object-cover border-4 border-white shadow-2xl"
        />

        {/* Star SVG */}
        <div className="absolute -top-6 -right-6 animate-spin-slow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 68 68"
            fill="none"
          >
            <path
              d="M34 0L43.6167 24.3833L68 34L43.6167 43.6167L34 68L24.3833 43.6167L0 34L24.3833 24.3833L34 0Z"
              fill="#CC0D39"
            ></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
