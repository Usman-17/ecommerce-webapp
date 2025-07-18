const CustomInput = ({
  type = "text",
  onChange,
  value,
  name,
  required = true,
  placeholder,
  minLength,
  maxLength,
  inputMode = "auto",
  autoComplete = "off",
  disabled = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      inputMode={inputMode}
      autoComplete={autoComplete}
      disabled={disabled}
      aria-label={placeholder}
      className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-[#fffaf3] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
    />
  );
};

export default CustomInput;
