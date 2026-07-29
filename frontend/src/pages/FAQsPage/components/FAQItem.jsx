import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
// Imports End-----

const FAQItem = ({ faq, isOpen, isLast, onToggle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={!isLast ? "border-b border-gray-100" : ""}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
      >
        <span
          className="font-medium text-sm sm:text-base pr-4 transition-colors duration-150"
          style={{
            color: isOpen || hovered ? "#dc2626" : "#1f2937",
          }}
        >
          {faq.question}
        </span>

        <Motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown
            className="w-5 h-5 transition-colors duration-150"
            style={{ color: isOpen || hovered ? "#dc2626" : "#9ca3af" }}
          />
        </Motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <Motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pt-4 text-gray-500 text-sm sm:text-md leading-relaxed border-t border-gray-100">
              {faq.answer}
            </p>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
