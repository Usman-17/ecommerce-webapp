import { Link } from "react-router";
import { UserRound, LogOut, Menu } from "lucide-react";

import useLogout from "../hooks/useLogout";
import useGetAuth from "../hooks/useGetAuth";
import { useSidebar } from "../context/SidebarContext";
// Imports End----

const Header = () => {
  const { logoutMutation } = useLogout();

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const { data: authUser } = useGetAuth();

  return (
    <header className="sticky top-0 flex w-full bg-white z-99999">
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
            {/* 2 User */}
            <Link to="/" className="flex items-center gap-2 p-1.5 rounded-md">
              <div>
                {authUser.profileImg.url ? (
                  <img
                    src={authUser.profileImg.url}
                    alt="image"
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <UserRound className="w-5 h-5" />
                )}
              </div>

              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-gray-800">
                  {authUser?.fullName}
                </span>
                <span className="text-gray-500 text-xs">{authUser?.email}</span>
              </div>
            </Link>

            <div className="cursor-pointer hover:text-gray-700">
              <LogOut size={20} onClick={() => logoutMutation()} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
