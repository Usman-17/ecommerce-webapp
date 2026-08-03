import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  MapPin,
  Settings,
  LogOut,
  Headphones,
  Loader,
  User,
} from "lucide-react";

import { useUser, setUser } from "../../../../hooks/useUser";
// Imports End-----

const ProfileLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loggingOut, setLoggingOut] = useState(false);

  const user = useUser();

  const handleLogout = () => {
    setLoggingOut(true);
  };

  useEffect(() => {
    if (!loggingOut) return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setUser(null);
      navigate("/");
      requestAnimationFrame(() => {
        document.body.style.overflow = "";
      });
    }, 200);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [loggingOut, navigate]);

  const sidebarNav = [
    { label: "Dashboard", icon: Home, to: "/profile" },
    { label: "Orders", icon: Package, to: "/profile/orders" },
    { label: "Addresses", icon: MapPin, to: "/profile/addresses" },
    {
      label: "Account Settings",
      icon: Settings,
      to: "/profile/account-settings",
    },
  ];

  return (
    <div className="md:p-6 lg:px-[4vw] min-h-screen">
      {/* Logout Overlay — covers entire viewport including header */}
      {loggingOut && (
        <div className="fixed inset-0 z-100 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#CC0D39]/10 flex items-center justify-center">
              <Loader size={24} className="animate-spin text-[#CC0D39]" />
            </div>
            <span className="text-sm font-semibold text-gray-500">
              Logging out...
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2.5 items-stretch">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 h-full">
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-linear-to-br from-[#FFE8D6] to-[#FFD6BA] flex items-center justify-center overflow-hidden">
                {user?.logoImageURL ? (
                  <img
                    src={user.logoImageURL}
                    alt={user.partyName}
                    className="w-full h-full object-cover"
                  />
                ) : user?.partyName ? (
                  <span className="text-3xl font-black text-[#CC0D39]">
                    {user.partyName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={32} className="text-[#CC0D39]" />
                )}
              </div>
              <h3 className="text-base font-black text-gray-900">
                {user?.partyName}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {sidebarNav.map((item, idx) => {
                const isActive =
                  item.to === "/profile"
                    ? pathname === "/profile"
                    : pathname === item.to ||
                      pathname.startsWith(item.to + "?") ||
                      pathname.startsWith(item.to + "/") ||
                      (item.to === "/profile/addresses" &&
                        pathname.startsWith("/profile/address"));
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#CC0D39]/5 text-[#CC0D39] border-[#CC0D39] py-3"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                disabled={loggingOut || !user}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut size={18} strokeWidth={1.8} />
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </nav>

            {/* Help Card */}
            <div className="mt-6 p-4 bg-linear-to-br from-[#FFF0F0] to-[#FFF5F5] rounded-xl border border-[#E14A5C]/10">
              <div className="w-10 h-10 rounded-full bg-[#E14A5C]/10 flex items-center justify-center mb-3">
                <Headphones size={18} className="text-[#E14A5C]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Need Help?</h4>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                We&apos;re here for you!
              </p>
              <Link
                to="/contact-us"
                className="mt-3 w-full flex items-center justify-center py-2 bg-[#E14A5C] text-white text-xs font-bold rounded-lg hover:bg-[#CC0D39] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 bg-[#FFF8F5] rounded-xl flex flex-col">
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
