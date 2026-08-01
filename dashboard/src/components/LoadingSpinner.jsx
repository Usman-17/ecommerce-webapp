import { Loader } from "lucide-react";

const LoadingSpinner = ({ content, width }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${width || "w-full"}`}
    >
      <Loader size={18} className="animate-spin" />
      {content && <span>{content}</span>}
    </div>
  );
};

export default LoadingSpinner;
