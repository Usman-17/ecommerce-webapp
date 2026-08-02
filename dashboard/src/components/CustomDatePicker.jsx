import dayjs from "dayjs";
import { DatePicker } from "antd";
import { forwardRef } from "react";

const CustomDatePicker = forwardRef(
  (
    {
      id,
      label,
      value,
      onChange,
      placeholder = "Select Date",
      required = false,
      disabled = false,
      allowClear = false,
      format = "DD/MM/YYYY",
      className = "",
      helperText,
      ...rest
    },
    ref,
  ) => {
    const dateValue = value
      ? dayjs.isDayjs(value)
        ? value
        : dayjs(value)
      : null;

    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
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

        <DatePicker
          id={id}
          ref={ref}
          value={dateValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          allowClear={allowClear}
          format={format}
          className="w-full my-custom-datepicker"
          popupClassName="!z-[1000000]"
          popupStyle={{ zIndex: 1000000 }}
          getPopupContainer={() => document.body}
          {...rest}
        />

        {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
      </div>
    );
  },
);

CustomDatePicker.displayName = "CustomDatePicker";

export default CustomDatePicker;
