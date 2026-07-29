import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PriceFilter = ({ priceRange, setPriceRange, actualPriceRange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Price Range
      </label>

      <div className="px-2 pt-2 pb-1">
        <Slider
          range
          min={actualPriceRange[0]}
          max={actualPriceRange[1]}
          value={priceRange}
          onChange={(value) => setPriceRange(value)}
          allowCross={false}
          trackStyle={[{ backgroundColor: "var(--color-accent)", height: 4 }]}
          handleStyle={[
            {
              borderColor: "var(--color-accent)",
              backgroundColor: "white",
              opacity: 1,
              width: 16,
              height: 16,
              marginTop: -6,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
            {
              borderColor: "var(--color-accent)",
              backgroundColor: "white",
              opacity: 1,
              width: 16,
              height: 16,
              marginTop: -6,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          ]}
          railStyle={{ backgroundColor: "#e5e7eb", height: 4 }}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-medium text-gray-600">
            Rs {priceRange[0].toLocaleString()}
          </span>

          <span className="text-sm font-medium text-gray-600">
            Rs {priceRange[1].toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
