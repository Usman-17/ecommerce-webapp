import { Users, Package, Star, ShieldCheck } from "lucide-react";

const statsData = [
  {
    icon: Users,
    value: "50K+",
    title: "Happy Customers",
    desc: "Thousands of customers trust us for their shopping needs.",
  },
  {
    icon: Package,
    value: "10K+",
    title: "Products Sold",
    desc: "We have delivered thousands of products across Pakistan.",
  },
  {
    icon: Star,
    value: "4.9/5",
    title: "Customer Rating",
    desc: "Our customers love us! Check out our excellent reviews.",
  },
  {
    icon: ShieldCheck,
    value: "99%",
    title: "Satisfaction Rate",
    desc: "We ensure the best experience and satisfaction every time.",
  },
];

const ImpactStats = () => {
  return (
    <section className="rounded-xl border border-[#f1f1f1] bg-white px-6 py-14 md:px-10">
      {/* Top Content */}
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ffdede] bg-[#fff6f6] px-4 py-1.5 text-sm font-semibold text-[#ff4d4d]">
          <span className="h-2 w-2 rounded-full bg-[#ff4d4d]" />
          OUR IMPACT
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
          Numbers That Reflect{" "}
          <span className="text-[#ff4d4d]">Our Commitment</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-base text-[#6b7280] md:text-md">
          We are proud of the trust our customers place in us and the numbers
          that drive us forward.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statsData.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-xl border border-[#f2f2f2] bg-white px-6 py-10 text-center shadow-xs"
            >
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5f5]">
                <Icon size={34} className="text-[#ff4d4d]" strokeWidth={1.8} />
              </div>

              {/* Value */}
              <h3 className="mt-6 text-4xl font-bold text-[#ff2f2f]">
                {item.value}
              </h3>

              {/* Title */}
              <h4 className="mt-3 text-xl font-semibold text-[#111827]">
                {item.title}
              </h4>

              {/* Description */}
              <p className="mt-4 text-sm leading-6 text-[#6b7280]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ImpactStats;
