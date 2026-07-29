import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";

const CustomInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
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
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-0.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative flex ${type === "textarea" ? "items-start" : "items-center"}`}
      >
        {Icon && (
          <Icon
            className={`absolute left-3 text-gray-400 group-focus-within:text-gray-500 transition-colors pointer-events-none ${
              type === "textarea" ? "top-3.5" : ""
            }`}
            size={16}
          />
        )}

        {type === "textarea" ? (
          <textarea
            id={id || name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            name={name || id}
            rows={rows || 4}
            spellCheck={spellCheck}
            className={`w-full bg-white border rounded-lg ${
              Icon ? "pl-10 pr-4 py-3" : "px-3 py-2"
            } text-sm font-semibold text-gray-900 outline-none transition-all resize-none placeholder:font-medium placeholder:text-gray-300 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                : "border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-300/10"
            } ${inputClassName}`}
          />
        ) : (
          <input
            id={id || name}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            inputMode={inputMode}
            ref={ref}
            min={0}
            minLength={minLength}
            maxLength={maxLength}
            name={name || id}
            spellCheck={spellCheck}
            className={`w-full bg-white border rounded-lg placeholder:text-sm placeholder:font-medium ${
              Icon ? "pl-10 pr-4 py-3" : "px-3 py-2"
            } text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-300 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                : "border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-300/10"
            } ${inputClassName}`}
          />
        )}

        {isPassword && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`${passwordClassName} absolute right-4 top-1/2 -translate-y-1/2 transition text-gray-400 hover:text-gray-600`}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}

        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader size={16} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium ml-1">{error}</p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-[10px] text-gray-400 font-medium ml-1">
          {helperText}
        </p>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Remove number input arrows in all browsers */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          -webkit-text-fill-color: #111827 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default CustomInput;
