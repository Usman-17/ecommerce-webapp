import { Link } from "react-router-dom";

const CustomButton = ({
  to = "/shop",
  text = "Start Shopping",
  className = "",
  icon: Icon,
}) => {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.97] active:opacity-80 active:ring-2 active:ring-white/20 select-none ${className}`}
    >
      {text}

      {Icon && (
        <Icon
          size={14}
          className="mt-1 transition-transform duration-150 group-hover:translate-x-1 group-active:translate-x-0.5"
        />
      )}
    </Link>
  );
};

export default CustomButton;
