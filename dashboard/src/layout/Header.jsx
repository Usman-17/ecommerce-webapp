import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { UserRound, LogOut, Menu, ChevronDown, Lock } from "lucide-react";

import useLogout from "../hooks/useLogout";
import useGetAuth from "../hooks/useGetAuth";
import { useSidebar } from "../context/SidebarContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
// Imports End----

const Header = () => {
  const { logoutMutation } = useLogout();
  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
  const { data: authUser } = useGetAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 flex w-full bg-white z-99999 ${isMobileOpen ? "hidden" : ""}`}
      >
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          <div className="flex items-center justify-between w-full gap-2 px-3 py-1.5 border-b border-gray-200 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-2">
            {/* 1 Menu Button */}
            <button
              className="flex items-center justify-center w-9 h-9 text-gray-500 rounded-lg z-99999 transition-colors cursor-pointer hover:bg-gray-100 hover:text-gray-700"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            {/* Menu Button End */}

            <div className="flex items-center justify-end gap-3">
              {/* 2 User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div>
                    {authUser?.profileImg?.url ? (
                      <img
                        src={authUser.profileImg.url}
                        alt="image"
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <UserRound className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <div className="hidden sm:flex flex-col text-sm leading-tight text-left">
                    <span className="font-medium text-gray-800">
                      {authUser?.fullName}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {authUser?.email}
                    </span>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`hidden sm:block text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {authUser?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {authUser?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowChangePassword(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Lock size={15} />
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logoutMutation();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default Header;
