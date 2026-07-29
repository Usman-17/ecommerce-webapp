import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const SortDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  triggerClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-[#fffaf5] border border-[#e8ddd0] rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-warm focus:outline-none transition-all duration-200 min-w-45 ${triggerClassName}`}
      >
        <span>{currentLabel}</span>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className={`absolute right-0 mt-2 w-full bg-[#fffaf5] border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden ${menuClassName}`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                  value === option.value
                    ? "bg-[#f7f1ec] text-primary font-semibold"
                    : "text-gray-700 hover:bg-[#fdf3ea]"
                }`}
              >
                <span>{option.label}</span>

                {value === option.value && (
                  <Check className="text-primary" size={14} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
