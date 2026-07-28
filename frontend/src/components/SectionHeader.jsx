import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import InViewAnimation from "./InViewAnimation";

const SectionHeader = ({
  label,
  title,
  description,
  viewAllLink,
  delay = 0.1,
}) => {
  return (
    <InViewAnimation delay={delay}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-center sm:text-left w-full">
          <p className="text-[13px] uppercase tracking-[3px] font-bold text-[#CC0D39] mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Sparkles size={14} className="animate-pulse" />
            {label}
          </p>

          <h2 className="text-2xl md:text-3xl font-playfair text-gray-900">
            {title}
          </h2>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="hidden sm:inline-flex items-center border border-gray-300 rounded-full px-6 py-2 text-sm font-medium text-gray-700 hover:bg-[#CC0D39] hover:text-white hover:border-[#CC0D39] transition-all duration-200 shrink-0"
          >
            View All
          </Link>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-500 mb-8 sm:mb-6 text-center sm:text-left max-w-xs sm:max-w-sm mx-auto sm:mx-px">
          {description}
        </p>
      )}
    </InViewAnimation>
  );
};

export default SectionHeader;
