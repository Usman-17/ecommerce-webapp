import { useEffect, useRef } from "react";
import { Award, HeadphonesIcon, ShieldCheck, Truck } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex h-full flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
      <Icon size={28} className="text-accent" />
    </div>

    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-55">
      {description}
    </p>
  </div>
);

const AboutFeatures = () => {
  const scrollRef = useRef(null);

  const features = [
    {
      icon: Award,
      title: "Quality Products",
      description:
        "We handpick only the best products to ensure premium quality.",
    },
    {
      icon: HeadphonesIcon,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      description: "Your data and payments are always safe and protected.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "We ensure timely and reliable delivery at your doorstep.",
    },
  ];

  useEffect(() => {
    // On mobile, start at the second card (index 1) to show peeks of left/right cards
    if (window.innerWidth < 768 && scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth * 0.85;
      const gap = 16;
      container.scrollLeft = cardWidth / 2 + gap;
    }
  }, []);

  return (
    <section className="py-4">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto pb-2 pt-2 px-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {features.map((item, index) => (
          <div
            key={index}
            className="w-[85%] shrink-0 snap-center sm:w-[calc(50%-8px)] md:w-auto md:shrink"
          >
            <FeatureCard
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutFeatures;
