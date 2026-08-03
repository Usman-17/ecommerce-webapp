import { useState } from "react";
import { User, Shield } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useUser } from "../../../../../hooks/useUser";
import AuthModal from "../../../../../components/AuthModal";
import AccountSettingsSkeleton from "./AccountSettingsSkeleton";
// Imports End-----

const settingsNav = [
  { label: "Profile Information", icon: User, to: "/profile/account-settings" },
  { label: "Security", icon: Shield, to: "/profile/account-settings/security" },
];

const AccountSettingsLayout = () => {
  const user = useUser();
  const [isAuthOpen, setIsAuthOpen] = useState(!user);

  if (!user) {
    return (
      <>
        <AccountSettingsSkeleton />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 shrink-0">
        <h1 className="text-xl font-extrabold text-gray-900">
          Account Settings
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Manage your personal information, security and preferences
        </p>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <aside className="w-56 shrink-0 border-r border-gray-50 p-3">
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/profile/account-settings"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? item.danger
                        ? "bg-red-50 text-red-500"
                        : "bg-[#FFF0F0] text-[#CC0D39]"
                      : item.danger
                        ? "text-red-400 hover:bg-red-50 hover:text-red-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`
                }
              >
                <item.icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 py-3.5 px-2 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsLayout;
