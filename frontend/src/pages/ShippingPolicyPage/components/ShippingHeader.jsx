import shippingTruck from "../../../assets/shipping-truck.png";

const BubbleLeft = () => (
  <div
    className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-60 hidden md:block z-10"
    style={{
      background:
        "radial-gradient(circle, rgba(254,202,202,0.6) 0%, rgba(255,245,245,0) 70%)",
    }}
  />
);

const BubbleRight = () => (
  <svg
    className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 opacity-80 hidden sm:block"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle cx="24" cy="24" r="24" fill="#fecaca" />
    <circle cx="18" cy="20" r="5" fill="#f87171" />
    <circle cx="30" cy="28" r="3" fill="#dc2626" />
    <circle cx="24" cy="16" r="2" fill="white" opacity="0.7" />
  </svg>
);

const DotsPattern = () => (
  <svg
    className="absolute right-24 top-3 opacity-20 hidden md:block"
    width="80"
    height="40"
    viewBox="0 0 80 40"
  >
    {[0, 1, 2, 3].map((col) =>
      [0, 1, 2].map((row) => (
        <circle
          key={`${col}-${row}`}
          cx={col * 20 + 10}
          cy={row * 16 + 8}
          r="2.5"
          fill="#dc2626"
        />
      )),
    )}
  </svg>
);

const ShippingHeader = () => (
  <div
    className="relative overflow-hidden rounded-2xl px-8 py-13 text-center"
    style={{
      background:
        "linear-gradient(135deg, #fff5f5 0%, #fee2e2 50%, #fff5f5 100%)",
      border: "1px solid #fecaca",
    }}
  >
    <BubbleLeft />

    <img
      src={shippingTruck}
      alt="Shipping Truck"
      className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-90 object-contain z-20 drop-shadow-2xl"
    />

    <BubbleRight />
    <DotsPattern />

    {/* Badge */}
    <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-red-200 rounded-full px-3 py-1 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
      <span className="text-xs font-semibold text-red-600 tracking-wide uppercase">
        Shipping
      </span>
    </div>

    {/* Heading */}
    <h2
      className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
      style={{ color: "#1a0a0a" }}
    >
      Shipping{" "}
      <span
        style={{
          background: "linear-gradient(90deg, #dc2626, #f87171)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Policy
      </span>
    </h2>

    <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
      Learn about our delivery process, shipping timelines, packaging standards,
      and nationwide shipping services.
    </p>
  </div>
);

export default ShippingHeader;
