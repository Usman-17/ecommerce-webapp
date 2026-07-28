import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";

const CustomInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  inputMode,
  required = false,
  minLength,
  maxLength,
  ref,
  className,
  inputClassName,
  passwordClassName,
  rows,
  isLoading = false,
  icon: Icon,
  error,
  helperText,
  spellCheck = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className={`custom-input relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          {label}{" "}
          {required ? (
            <span className="text-red-500 font-semibold">*</span>
          ) : (
            <span className="text-xs font-normal text-gray-400">
              (Optional)
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 transition-colors duration-300 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        {type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            name={id}
            rows={rows || 4}
            spellCheck={spellCheck}
            className={`${inputClassName} w-full rounded-lg border ${
              Icon ? "pl-10" : "pl-3"
            } pr-2 py-2 transition-all duration-200 shadow-sm
          focus:outline-none placeholder:text-sm text-sm sm:text-[15px]
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "bg-white border-gray-200 hover:border-gray-400 focus:border-(--secondary-color) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--secondary-color)_15%,transparent)]"
          }
          text-gray-900 placeholder-gray-400
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
          />
        ) : (
          <input
            id={id}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            inputMode={inputMode}
            ref={ref}
            min={0}
            minLength={minLength}
            maxLength={maxLength}
            name={id}
            spellCheck={spellCheck}
            className={`${inputClassName} w-full rounded-lg border ${
              Icon ? "pl-10" : "pl-3"
            } pr-2 py-2 transition-all duration-200 shadow-sm
          focus:outline-none placeholder:text-sm text-sm sm:text-[15px]
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "bg-white border-gray-200 hover:border-gray-400 focus:border-(--secondary-color) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--secondary-color)_15%,transparent)]"
          }
          text-gray-900 placeholder-gray-400
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
          />
        )}

        {isPassword && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`${passwordClassName} absolute right-3 top-1/2 transform -translate-y-1/2 transition cursor-pointer text-gray-500 hover:text-gray-700`}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader
              size={16}
              className="shrink-0 animate-spin text-(--secondary-color)"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield; 
        }

        .custom-input input:-webkit-autofill,
        .custom-input input:-webkit-autofill:hover,
        .custom-input input:-webkit-autofill:focus,
        .custom-input input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--input-bg) inset !important;
          -webkit-text-fill-color: var(--input-text) !important;
          caret-color: var(--secondary-color) !important;
          border-color: var(--secondary-color) !important;
          outline-color: var(--secondary-color) !important;
        }
      `}</style>
    </div>
  );
};

export default CustomInput;
