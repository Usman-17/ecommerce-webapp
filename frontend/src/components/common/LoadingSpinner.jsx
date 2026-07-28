import { Loader } from "lucide-react";

const LoadingSpinner = ({ content, width, className, iconColor, textColor }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${width || "w-full"} ${className || ""}`}
    >
      <Loader
        className={`animate-spin ${iconColor || "text-primary"}`}
        size={16}
      />
      {content && (
        <span className={`text-sm font-medium ${textColor || "text-gray-700"}`}>
          {content}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
