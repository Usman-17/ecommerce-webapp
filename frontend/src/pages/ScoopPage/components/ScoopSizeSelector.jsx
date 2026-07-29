import { SCOOP_CONFIG } from "../scoopData";
import { motion as Motion } from "framer-motion";

import ScoopSizeCard from "./ScoopSizeCard";

const ScoopSizeSelector = ({
  selectedSize,
  onSelectSize,
  selectedQuantity,
  onSelectQuantity,
  shakeSizeSelector,
}) => {
  const sizes = Object.values(SCOOP_CONFIG);

  return (
    <section className="py-10 sm:py-14">
      <div className="text-center mb-8 sm:mb-10 relative">
        <div className="absolute left-1/4 top-0 text-pink-300 text-base sm:text-lg hidden sm:block">
          ✦
        </div>
        <div className="absolute right-1/4 top-2 text-pink-300 text-sm hidden sm:block">
          ✧
        </div>
        <div className="absolute left-[15%] bottom-0 text-amber-300 text-lg sm:text-xl hidden sm:block">
          ✦
        </div>
        <div className="absolute right-[15%] bottom-0 text-amber-300 text-xs hidden sm:block">
          ✧
        </div>
        <div className="absolute right-[10%] top-1/2 text-pink-300 text-xl sm:text-2xl hidden sm:block">
          ♡
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <span className="text-pink-300 text-sm sm:text-lg hidden sm:block">
            ✦
          </span>
          <p className="text-[11px] uppercase tracking-[3px] font-bold text-accent">
            Step 1
          </p>
          <span className="text-pink-300 text-sm sm:text-lg hidden sm:block">
            ✦
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-heading">
          Choose Your <span className="text-accent">Scoop</span> Size
        </h2>

        <p className="text-gray-500 sm:mt-2 text-sm sm:text-base max-w-60 mx-auto sm:max-w-none">
          Pick the perfect scoop for your surprise experience
        </p>
      </div>

      <Motion.div
        animate={
          shakeSizeSelector ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto px-2 sm:px-4 items-stretch">
          {sizes.map((size) => (
            <ScoopSizeCard
              key={size.id}
              config={size}
              isSelected={selectedSize === size.id}
              onSelect={onSelectSize}
              selectedQuantity={selectedSize === size.id ? selectedQuantity : 1}
              onSelectQuantity={onSelectQuantity}
            />
          ))}
        </div>
      </Motion.div>
    </section>
  );
};

export default ScoopSizeSelector;
