// eslint-disable-next-line no-unused-vars
const SummaryCard = ({ icon: Icon, title, count, color, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-md rounded-xl p-5 flex items-center gap-4 border-l-4 transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-lg" : ""
      }`}
      style={{
        borderColor: color,
        boxShadow: active ? `0 0 0 2px ${color}40` : undefined,
      }}
    >
      <div
        className={`p-3 rounded-full`}
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className="text-2xl font-bold" style={{ color }}>
          {count}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
