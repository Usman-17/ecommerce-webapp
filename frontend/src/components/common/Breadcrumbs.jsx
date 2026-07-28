import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium mb-2 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 sm:py-0.5">
      <Link
        to="/"
        className="flex items-center text-gray-400 hover:text-accent transition-colors duration-200"
      >
        <span>Home</span>
      </Link>

      <ChevronRight size={14} className="text-gray-300 shrink-0" />

      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === items.length - 1 ? (
            <span className="text-accent font-semibold">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-400 hover:text-accent transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
