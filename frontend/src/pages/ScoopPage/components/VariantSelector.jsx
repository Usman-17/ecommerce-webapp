import { Check } from "lucide-react";

const isLightColor = (hex) => {
  if (!hex) return false;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.65;
};

const VariantSelector = ({ option, selectedDetailId, onSelect }) => {
  const details = option.productOptionDetailResponses || [];
  const typeName = (option.productOptionTypeName || "").toLowerCase();
  const isColor = typeName === "color";

  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
        {option.productOptionTypeName}
      </label>

      {isColor ? (
        /* Color swatches */
        <div className="flex flex-wrap gap-1.5">
          {details.map((detail) => {
            const isSelected =
              selectedDetailId === detail.productOptionDetailId;
            const hex = detail.optionDetailHEXCode;
            return (
              <button
                key={detail.productOptionDetailId}
                type="button"
                onClick={() => onSelect(detail.productOptionDetailId)}
                title={detail.optionDetailName}
                className={`relative h-6 w-6 rounded-full border transition-all duration-200 active:scale-90 ${
                  isSelected
                    ? "border-gray-400 ring-1 ring-gray-300 scale-110"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{ backgroundColor: hex || "#ccc" }}
                aria-label={`${option.productOptionTypeName}: ${detail.optionDetailName}`}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={10}
                      strokeWidth={3}
                      className={
                        isLightColor(hex) ? "text-gray-700" : "text-white"
                      }
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Text-based options (size, shade, etc.) */
        <div className="flex flex-wrap gap-1.5">
          {details.map((detail) => {
            const isSelected =
              selectedDetailId === detail.productOptionDetailId;
            return (
              <button
                key={detail.productOptionDetailId}
                type="button"
                onClick={() => onSelect(detail.productOptionDetailId)}
                className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "border-accent bg-accent text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {detail.optionDetailName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
