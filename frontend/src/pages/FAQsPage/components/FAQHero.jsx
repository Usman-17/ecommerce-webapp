/* ── Decorative SVGs ───────────────────────────────────────── */
const BubbleLeft = () => (
  <svg
    className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 opacity-90 hidden sm:block"
    viewBox="0 0 64 64"
    fill="none"
  >
    <circle cx="32" cy="32" r="32" fill="#fee2e2" />
    <circle cx="32" cy="32" r="20" fill="#fca5a5" />
    <circle cx="24" cy="24" r="6" fill="white" opacity="0.6" />
    <text x="22" y="38" fontSize="18" fill="#dc2626">
      ?
    </text>
  </svg>
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

const FAQHero = () => (
  <div
    className="relative overflow-hidden rounded-2xl px-8 py-10 text-center"
    style={{
      background:
        "linear-gradient(135deg, #fff5f5 0%, #fee2e2 50%, #fff5f5 100%)",
      border: "1px solid #fecaca",
    }}
  >
    <BubbleLeft />
    <BubbleRight />
    <DotsPattern />

    {/* Badge */}
    <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-red-200 rounded-full px-3 py-1 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
      <span className="text-xs font-semibold text-red-600 tracking-wide uppercase">
        FAQ
      </span>
    </div>

    {/* Heading */}
    <h2
      className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
      style={{ color: "#1a0a0a" }}
    >
      Frequently Asked{" "}
      <span
        style={{
          background: "linear-gradient(90deg, #dc2626, #f87171)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Questions
      </span>
    </h2>

    <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
      Find answers to the most common questions about orders, shipping, and
      returns. If you need more help, we're just a message away.
    </p>
  </div>
);

export default FAQHero;
