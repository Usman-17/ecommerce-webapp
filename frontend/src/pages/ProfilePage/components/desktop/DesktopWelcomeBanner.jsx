const DesktopWelcomeBanner = ({ user }) => {
  return (
    <div className="relative bg-linear-to-br from-[#FFF0E8] via-[#FFF5EF] to-[#FFE8D6] rounded-lg p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0D39]/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-[#FF6B9D]/10 rounded-full blur-2xl -mb-10" />

      <div className="relative z-10">
        <span className="text-sm font-bold text-[#CC0D39]">
          Hi, {user?.partyName?.split(" ")[0] || "there"} 👋
        </span>

        <h1 className="text-3xl font-black text-gray-900 mt-1">
          Welcome back!
        </h1>

        <p className="text-sm text-gray-500 font-medium mt-2 max-w-sm">
          Manage your orders, track deliveries and explore your favorite items
          all in one place.
        </p>
      </div>
    </div>
  );
};

export default DesktopWelcomeBanner;
