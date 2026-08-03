import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Loader,
  User,
  Shield,
} from "lucide-react";

import { useUser, setUser } from "../../../../hooks/useUser";
// Imports End------

const ProfileMenu = () => {
  const navigate = useNavigate();
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

  const menuGroups = [
    {
      title: "Account Settings",
      items: [
        {
          label: "Profile Information",
          icon: User,
          to: "/profile/info",
          requiresAuth: true,
        },
        {
          label: "Change Password",
          icon: Shield,
          to: "/profile/security",
          requiresAuth: true,
        },
        {
          label: "Address Book",
          icon: MapPin,
          to: "/profile/addresses",
          requiresAuth: true,
        },
      ],
    },
    {
      title: "Support & Privacy",
      items: [
        { label: "Privacy Policy", icon: ShieldCheck, to: "/privacy-policy" },
      ],
    },
  ];

  const handleItemClick = (item) => {
    if (item.requiresAuth && !user) {
      navigate("/login");
    } else {
      navigate(item.to);
    }
  };

  return (
    <div className="mx-3 mt-5 space-y-4 pb-12">
      {/* Logout Overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-100 bg-white/80 backdrop-blur-sm flex items-center justify-center">
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

      {menuGroups.map((group, groupIdx) => (
        <div key={groupIdx}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">
            {group.title}
          </h3>
          <div className="bg-white rounded-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {group.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  itemIdx !== group.items.length - 1
                    ? "border-b border-gray-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-600">
                    <item.icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {user && (
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loggingOut ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
        </button>
      )}
    </div>
  );
};

export default ProfileMenu;
