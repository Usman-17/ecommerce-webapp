import { Check } from "lucide-react";

const AddressTypeSelector = ({ value, onChange, options }) => {
  return (
    <div className="space-y-1 mb-4">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        Address Type
      </label>

      {/* Mobile: original simple layout */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md border transition-all duration-200 ${
                isSelected
                  ? "border-accent bg-accent/5 text-accent shadow-sm"
                  : "border-gray-100 bg-gray-100/70 text-gray-400 hover:border-gray-200"
              }`}
            >
              <div className="p-1.5 rounded-lg transition-colors shrink-0">
                <img
                  src={option.icon}
                  alt={option.label}
                  className={`w-5 h-5 object-contain ${
                    isSelected ? "opacity-100" : "opacity-60 grayscale"
                  }`}
                />
              </div>
              <span
                className={`text-[13px] font-bold whitespace-nowrap ${
                  isSelected ? "text-primary" : "text-gray-500"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop: horizontal cards */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[#CC0D39] bg-[#FFF0F0]/50 shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-[#FFF0F0]" : "bg-gray-100"
                }`}
              >
                <img
                  src={option.icon}
                  alt={option.label}
                  className={`w-5 h-5 object-contain transition-all ${
                    isSelected ? "opacity-100" : "opacity-60 grayscale"
                  }`}
                />
              </div>

              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-bold ${
                    isSelected ? "text-[#CC0D39]" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    isSelected ? "text-[#CC0D39]/70" : "text-gray-400"
                  }`}
                >
                  {option.description}
                </p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#CC0D39] flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AddressTypeSelector;
