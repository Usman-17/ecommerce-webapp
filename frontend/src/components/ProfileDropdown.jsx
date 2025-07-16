import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, LogOut, ShoppingCart, UserRound } from "lucide-react";
import useLogout from "../hooks/useLogout";
import useGetAuth from "../hooks/useGetAuth";
// Imports End

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const { data: authUser } = useGetAuth();
  const { logoutMutation } = useLogout();

  useEffect(() => {
    closeDropdown();
  }, [authUser]);
  return (
    <>
      {authUser ? (
        <div className="relative z-10 group" onMouseLeave={closeDropdown}>
          {/* Avatar */}
          <img
            src={
              (authUser && authUser?.profileImg && authUser.profileImg.url) ||
              "/avatar-placeholder.png"
            }
            alt="avatar"
            onClick={toggleDropdown}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition duration-200 object-contain"
          />

          <div
            className={`absolute right-0 pt-2 sm:pt-1 px-1 sm:px-3 transition-opacity duration-200 ${
              isOpen ? "block" : "hidden sm:group-hover:block"
            }`}
          >
            <div className="flex flex-col gap-1 w-44 sm:w-52 px-1 sm:px-2 py-2 sm:py-3 bg-[#fffaf1] border border-gray-200 shadow-lg rounded-lg text-gray-600">
              {/* Profile */}
              <Link
                to="profile"
                className="flex items-center gap-3 py-1 px-3 rounded-full hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-150 text-sm sm:text-base"
                onClick={closeDropdown}
              >
                <UserRound size={16} />
                My Profile
              </Link>

              {/* Order */}
              <Link
                to="/order"
                className="flex items-center gap-3 py-1 px-3 rounded-full hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-150 text-sm sm:text-base"
                onClick={closeDropdown}
              >
                <ShoppingCart size={16} />
                My Orders
              </Link>

              {/* Admin */}
              {authUser.role === "admin" && (
                <a
                  href={import.meta.env.VITE_ADMIN_PANEL_URL}
                  className="flex items-center gap-3 py-1 px-3 rounded-full hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-150 text-sm sm:text-base"
                  target="_blank"
                  onClick={closeDropdown}
                >
                  <ExternalLink size={16} />
                  <p>Admin Panel</p>
                </a>
              )}

              <hr />

              {/* Logout */}
              <div
                onClick={() => {
                  closeDropdown();
                  logoutMutation();
                }}
                className="flex items-center gap-3 py-1 px-3 rounded-full hover:bg-red-500  hover:text-white cursor-pointer transition-colors duration-150 mt-1 text-sm sm:text-base"
              >
                <LogOut size={16} />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className="relative flex items-center"
          aria-label="Login"
        >
          <span className="sr-only">Login</span>
          <UserRound className="cursor-pointer" />
        </Link>
      )}
    </>
  );
};

export default ProfileDropdown;
