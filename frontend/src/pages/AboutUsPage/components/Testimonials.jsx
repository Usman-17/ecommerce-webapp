import { Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    name: "Ali Khan",
    location: "Lahore, Pakistan",
    initials: "AK",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    review:
      "Excellent service and fast delivery! The product quality is amazing. Highly recommended.",
    rating: 5,
  },
  {
    name: "Sara Ahmed",
    location: "Karachi, Pakistan",
    initials: "SA",
    avatarBg: "bg-pink-100",
    avatarColor: "text-pink-700",
    review:
      "I love shopping here! Original products, secure payments, and great customer support.",
    rating: 5,
  },
  {
    name: "Usman Raza",
    location: "Islamabad, Pakistan",
    initials: "UR",
    avatarBg: "bg-emerald-100",
    avatarColor: "text-emerald-700",
    review:
      "Packaging was perfect and delivery was on time. Very reliable and trustworthy store.",
    rating: 5,
  },
  {
    name: "Ayesha Malik",
    location: "Faisalabad, Pakistan",
    initials: "AM",
    avatarBg: "bg-purple-100",
    avatarColor: "text-purple-700",
    review:
      "Great variety of products and the customer service team was very helpful with my exchange.",
    rating: 5,
  },
  {
    name: "Bilal Tariq",
    location: "Rawalpindi, Pakistan",
    initials: "BT",
    avatarBg: "bg-orange-100",
    avatarColor: "text-orange-700",
    review:
      "I was skeptical at first, but the quality exceeded my expectations. Will definitely order again.",
    rating: 4,
  },
  {
    name: "Fatima Noor",
    location: "Multan, Pakistan",
    initials: "FN",
    avatarBg: "bg-teal-100",
    avatarColor: "text-teal-700",
    review:
      "Smooth checkout process and quick delivery. The items were exactly as shown in the pictures.",
    rating: 5,
  },
  {
    name: "Zainab Shah",
    location: "Peshawar, Pakistan",
    initials: "ZS",
    avatarBg: "bg-rose-100",
    avatarColor: "text-rose-700",
    review:
      "Absolutely brilliant! The customer service was top-notch and the delivery was much faster than expected.",
    rating: 5,
  },
  {
    name: "Omar Farooq",
    location: "Quetta, Pakistan",
    initials: "OF",
    avatarBg: "bg-indigo-100",
    avatarColor: "text-indigo-700",
    review:
      "Very satisfied with my purchase. The material is premium and the price is very reasonable.",
    rating: 4,
  },
  {
    name: "Hira Jamil",
    location: "Sialkot, Pakistan",
    initials: "HJ",
    avatarBg: "bg-yellow-100",
    avatarColor: "text-yellow-700",
    review:
      "I've ordered from here three times already. They consistently deliver high-quality products every single time.",
    rating: 5,
  },
  {
    name: "Saad Hassan",
    location: "Gujranwala, Pakistan",
    initials: "SH",
    avatarBg: "bg-cyan-100",
    avatarColor: "text-cyan-700",
    review:
      "The return process was completely hassle-free. It's refreshing to see a store that actually cares about its customers.",
    rating: 5,
  },
  {
    name: "Nida Qureshi",
    location: "Hyderabad, Pakistan",
    initials: "NQ",
    avatarBg: "bg-lime-100",
    avatarColor: "text-lime-700",
    review:
      "Beautiful packaging and exactly as described on the website. I am very impressed with their attention to detail.",
    rating: 5,
  },
  {
    name: "Tariq Mehmood",
    location: "Bahawalpur, Pakistan",
    initials: "TM",
    avatarBg: "bg-red-100",
    avatarColor: "text-red-700",
    review:
      "Good quality, but delivery took a day longer than expected. Overall, a solid shopping experience.",
    rating: 4,
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < count
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

const TestimonialCard = ({
  name,
  location,
  initials,
  avatarBg,
  avatarColor,
  review,
  rating,
}) => (
  <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md sm:p-8">
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold shadow-sm sm:h-16 sm:w-16 ${avatarBg} ${avatarColor}`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="w-full truncate text-lg font-extrabold text-gray-900 sm:text-xl">
            {name}
          </p>

          <p className="w-full truncate text-xs font-semibold uppercase tracking-wider text-gray-400">
            {location}
          </p>

          <div className="mt-1 sm:mt-1">
            <StarRating count={rating} />
          </div>
        </div>
      </div>
    </div>
    <div className="relative mt-2 text-center sm:text-left">
      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
        "{review}"
      </p>
    </div>
  </div>
);

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [dotsCount, setDotsCount] = useState(0);

  const calculateDots = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const containerWidth = scrollRef.current.clientWidth;
      const itemWidth = scrollRef.current.children[0].clientWidth;
      // Add a small threshold for precision issues
      const itemsPerView = Math.round(containerWidth / itemWidth) || 1;
      const pages = Math.ceil(testimonials.length / itemsPerView);
      setDotsCount(pages > 0 ? pages : 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateDots();
      if (
        window.innerWidth < 640 &&
        scrollRef.current &&
        scrollRef.current.children.length > 1
      ) {
        const container = scrollRef.current;
        const itemWidth = container.children[0].offsetWidth;
        const gap = 24; // gap-6
        container.scrollLeft = itemWidth * 0.5 + gap;
      }
    }, 100);

    window.addEventListener("resize", calculateDots);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateDots);
    };
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const itemWidth = container.children[0]?.clientWidth || containerWidth;

      // Determine which item is most centered
      const centeredIndex = Math.round(scrollLeft / (itemWidth + 24));

      if (window.innerWidth < 640) {
        setActiveDot(centeredIndex);
      } else {
        const itemsPerView = Math.round(containerWidth / itemWidth) || 1;
        setActiveDot(Math.round(centeredIndex / itemsPerView));
      }
    }
  };

  const scrollToDot = (index) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const container = scrollRef.current;
      const itemWidth = container.children[0].clientWidth;
      const gap = 24;
      const containerWidth = container.clientWidth;
      const itemsPerView = Math.round(containerWidth / itemWidth) || 1;

      let targetScrollLeft;
      if (window.innerWidth < 640) {
        // Center the target item
        targetScrollLeft = index * (itemWidth + gap);
      } else {
        // Scroll by pages
        targetScrollLeft = index * itemsPerView * (itemWidth + gap);
      }

      container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
  };

  return (
    <section className="rounded-[30px] border border-gray-100 bg-gray-50/50 px-2 py-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-3xl text-center px-4">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Our Customers
        </div>

        {/* Heading */}
        <h2 className="mb-3 font-extrabold leading-tight text-gray-900 text-4xl">
          What Our <span className="text-accent">Customers</span> Say
        </h2>

        {/* Subheading */}
        <p className="mb-8 text-sm leading-relaxed text-gray-500 md:mb-12 md:text-base">
          We take pride in delivering the best experience.
          <br className="hidden sm:block" />
          Here&apos;s what our happy customers have to say.
        </p>
      </div>

      {/* Slider Container */}
      <div className="mx-auto max-w-7xl relative px-2 sm:px-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar pb-8 pt-2 px-4 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="w-[92%] shrink-0 snap-center sm:w-[calc((100%-24px)/2)] sm:snap-start lg:w-[calc((100%-48px)/3)]"
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        {/* Dots */}
        {dotsCount > 1 && (
          <div className="mt-8 hidden justify-center gap-2 sm:flex">
            {Array.from({ length: dotsCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToDot(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === i
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
