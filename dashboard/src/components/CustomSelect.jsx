import { Select } from "antd";
import { ChevronDown, Search } from "lucide-react";
import { forwardRef, useState, useEffect, useRef } from "react";

const CustomSelect = forwardRef(
  (
    {
      id,
      label,
      value,
      placeholder = "Select an option",
      required = false,
      options = [],
      onChange,
      disabled = false,
      loading = false,
      allowClear = true,
      mode = undefined,
      className = "",
      helperText,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const historyPushed = useRef(false);
    const selectRef = useRef(null);

    const closeDropdown = () => {
      setIsOpen(false);
      if (selectRef.current) {
        selectRef.current.blur();
      }
    };

    useEffect(() => {
      if (!isOpen) return;

      const onPopState = () => {
        closeDropdown();
        historyPushed.current = false;
      };

      if (!historyPushed.current) {
        historyPushed.current = true;
        window.history.pushState({ dropdownOpen: true }, "");
      }

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      window.addEventListener("popstate", onPopState);

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);

        window.removeEventListener("popstate", onPopState);
        if (historyPushed.current) {
          historyPushed.current = false;
          window.history.back();
        }
      };
    }, [isOpen]);

    return (
      <div
        className={`flex flex-col gap-1 w-full ${className}`}
        autoComplete="no-autofill"
      >
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

        <Select
          id={id}
          ref={(node) => {
            selectRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          mode={mode}
          showSearch
          allowClear={allowClear}
          value={
            value === "" ||
            value === null ||
            value === undefined ||
            value === 0 ||
            value === "0"
              ? undefined
              : value
          }
          placeholder={placeholder}
          loading={loading}
          optionFilterProp="label"
          onChange={(selectedValues, selectedOptions) => {
            if (mode === "multiple" && selectedValues.includes("SELECT_ALL")) {
              if (value?.length === options.length) {
                onChange([], []);
              } else {
                const allValues = options.map((opt) => opt.value);
                onChange(allValues, options);
              }
            } else {
              onChange(selectedValues, selectedOptions);
            }
          }}
          disabled={disabled}
          maxTagCount="responsive"
          className="w-full my-custom-select"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={
            mode === "multiple" && options.length > 0
              ? [
                  {
                    label:
                      value?.length === options.length
                        ? "Deselect All"
                        : "Select All",
                    value: "SELECT_ALL",
                    className: "select-all-option font-bold",
                  },
                  ...options,
                ]
              : options
          }
          autoComplete="no-autofill"
          popupClassName="!z-[9999]"
          dropdownStyle={{ zIndex: 9999 }}
          styles={{ popup: { root: { borderRadius: "12px" } } }}
          onOpenChange={(visible) => setIsOpen(visible)}
          suffixIcon={
            isOpen ? (
              <Search size={14} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )
          }
        />

        {helperText && (
          <p className="text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  },
);

export default CustomSelect;
