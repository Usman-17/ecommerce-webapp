import boxesImage from "../../../assets/about-us/boxes.png";

const AboutHero = () => {
  return (
    <section
      className="relative overflow-hidden rounded-2xl px-8 py-10"
      style={{
        background:
          "linear-gradient(135deg, #fff5f5 0%, #fee2e2 50%, #fff5f5 100%)",
        border: "1px solid #fecaca",
      }}
    >
      {/* Top Right Dots */}
      <div className="absolute top-5 right-16 grid grid-cols-4 gap-2 opacity-60">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-[#ffbcbc]" />
        ))}
      </div>

      {/* Right Circle */}
      <div className="hidden absolute right-4 top-1/2 sm:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#ffd6d6]">
        <div className="flex gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#ff7c7c]" />
          <span className="mt-1.5 h-2 w-2 rounded-full bg-[#ff7c7c]" />
        </div>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-2">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-accent/5 px-3 py-1 mb-5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-red-600">
              Who We Are
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#111827]">
            We're Here to Make
            <br />
            Shopping <span className="text-[#ff5a5a]">Easy for You</span>
          </h2>

          <p className="mt-2 sm:mt-3 max-w-sm text-sm leading-relaxed text-[#6b7280]">
            We are committed to providing high-quality products, exceptional
            customer service, and a seamless shopping experience. Your
            satisfaction is our top priority.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <div className="relative flex flex-col items-center">
            <img
              src={boxesImage}
              alt="About Boxes"
              className="relative z-10 w-full max-w-[320px] object-contain drop-shadow-xl"
            />

            {/* Floor Shadow */}
            <div className="absolute bottom-0 z-0 h-6 w-[80%] rounded-[50%] bg-black/25 blur-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
