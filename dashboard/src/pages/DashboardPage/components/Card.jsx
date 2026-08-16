const Card = ({ title, value, icon: Icon, subtitle, color }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
          style={{ backgroundColor: `${color || "#465FFF"}1A` }}
        >
          {Icon && (
            <Icon className="size-5" style={{ color: color || "#465FFF" }} />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{title}</p>
          <p className="text-lg font-bold text-gray-800 leading-tight">
            {value}
          </p>
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-gray-400 pl-[52px]">{subtitle}</p>
      )}
    </div>
  );
};

export default Card;
