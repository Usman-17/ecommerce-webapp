import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
// Imports End-----

const DesktopStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {stats.map((stat, idx) => (
        <Link
          key={idx}
          to={stat.to}
          className="bg-white p-4 rounded-lg border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xs transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
            >
              <stat.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-500 truncate">
                {stat.label}
              </p>
              <span className="text-xl font-black text-gray-900 block">
                {stat.count}
              </span>
              <p className="text-[11px] text-gray-400 font-medium">
                {stat.sub}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DesktopStatsGrid;
