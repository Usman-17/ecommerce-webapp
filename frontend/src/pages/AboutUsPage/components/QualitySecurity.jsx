import { BadgeCheck, ShieldCheck, Headphones, Shield } from "lucide-react";

const qualityData = [
  {
    icon: BadgeCheck,
    title: "Premium Quality Products",
  },
  {
    icon: Shield,
    title: "Secure Payments",
  },
  {
    icon: ShieldCheck,
    title: "100% Original Products",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
  },
];

const QualitySecurity = () => {
  return (
    <section className="flex-1 rounded-xl border border-gray-100 bg-white p-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Quality & Security Assured
        </h2>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          We follow the highest standards to ensure quality products and secure
          transactions.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {qualityData.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex h-25 flex-col items-center justify-center rounded-xl bg-[#fff8f8] p-3 text-center transition-all duration-300 "
            >
              <Icon size={28} className="text-[#ff4d4d]" strokeWidth={1.8} />

              <h3 className="mt-3 text-[11px] font-medium leading-tight text-[#374151]">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QualitySecurity;
