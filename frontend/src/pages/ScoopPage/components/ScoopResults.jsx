import { PartyPopper } from "lucide-react";

import ScoopProductCard from "./ScoopProductCard";
import InViewAnimation from "../../../components/InViewAnimation";
// Imports End-----

const ScoopResults = ({
  products,
  selections,
  selectedVariants,
  onVariantSelect,
  onQuickViewOpen,
}) => {
  return (
    <section className="py-8 sm:py-10">
      <InViewAnimation>
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <PartyPopper size={14} className="animate-pulse" />
            Your Scoop is Ready!
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-heading">
            You <span className="text-accent">scooped</span> {products.length}{" "}
            surprise products
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-70 mx-auto sm:max-w-xs">
            Select your preferred variants below to complete your scoop
          </p>
        </div>
      </InViewAnimation>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {products.map((product, i) => (
          <ScoopProductCard
            key={product._instanceId || `${product._id}-${i}`}
            product={product}
            selections={selections}
            selectedVariants={selectedVariants}
            onVariantSelect={onVariantSelect}
            onQuickViewOpen={onQuickViewOpen}
          />
        ))}
      </div>
    </section>
  );
};

export default ScoopResults;
