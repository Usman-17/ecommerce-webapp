/* eslint-disable no-unused-vars */
import { Users, Package, Star, ShieldCheck } from "lucide-react";

import img1 from "../../../assets/about-us/about-1.webp";
import img2 from "../../../assets/about-us/about-2.webp";
import img3 from "../../../assets/about-us/about-3.webp";
// Imports End----

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Package, value: "10K+", label: "Products Sold" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: ShieldCheck, value: "99%", label: "Satisfaction Rate" },
];

const OurStory = () => {
  return (
    <section className="rounded-xl border border-gray-100 bg-whiteshadow-sm p-2 md:p-10 lg:p-12">
      <div className="grid items-center lg:grid-cols-2 gap-2 lg:gap-20">
        {/* Left — Image Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-2">
            {/* Large image on left */}
            <div className="row-span-2">
              <img
                src={img1}
                alt="Shopping cart with boxes"
                className="h-full w-full rounded-xl object-cover shadow-sm"
              />
            </div>

            {/* Two small images on right */}
            <img
              src={img2}
              alt="Packing a box"
              className="h-full w-full rounded-xl object-cover shadow-sm"
            />

            <img
              src={img3}
              alt="Warehouse worker"
              className="h-full w-full rounded-xl object-cover shadow-sm"
            />
          </div>

          {/* Floating Widget */}
          <div className="hidden sm:absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-xl border border-gray-50 bg-white p-5 shadow-lg sm:w-[320px] lg:-bottom-12">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Users size={24} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Trusted by Thousands
                </h4>
                <p className="text-xs text-gray-500">
                  Serving happy customers across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Text + Stats */}
        <div className="mt-4 lg:mt-0">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-accent shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Our Story
          </div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-[#0f172a] md:text-5xl lg:text-[46px] lg:leading-[1.15]">
            Our Journey. Your Trust.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-accent">Our Commitment.</span>
              {/* Brush Stroke Underline */}
              <svg
                className="absolute -bottom-2 left-0 h-3 w-[105%] text-accent/30"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 6.5C45 2 120 0.5 199 5.5C120 2 45 4 1 6.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </h2>

          <div className="space-y-4 text-sm leading-[1.8] text-gray-500 md:text-base">
            <p>
              Founded with a passion for delivering value and convenience, we
              started our journey to bring the best products to customers across
              Pakistan.
            </p>
            <p>
              Over the years, we have grown because of your trust and support.
            </p>
            <p>
              We continuously strive to improve, innovate, and deliver an
              outstanding shopping experience.
            </p>
          </div>

          {/* Stats Row */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-y-8 rounded-3xl p-4 md:flex-nowrap md:gap-y-0 md:divide-x md:divide-gray-100">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={i}
                className="flex w-1/2 flex-col items-center px-2 text-center md:w-1/4 md:px-4"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mb-1 text-xl font-bold text-accent">{value}</h3>
                <p className="text-[11px] font-medium text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
