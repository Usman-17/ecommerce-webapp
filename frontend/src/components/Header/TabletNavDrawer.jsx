import { useEffect } from "react";
import { X, Heart, User, Search } from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";

import logo from "../../assets/logo.webp";
import cartIcon from "../../assets/cart.png";

import { useUser } from "../../hooks/useUser";
import { useGetAllProductAreas } from "../../hooks/useGetAllProductAreas";

import { getCart } from "../../utils/cartStorage";
// Imports End-----

const navLinks = [
  { to: "/", label: "HOME" },
  { to: "/shop", label: "SHOP" },
  { to: "/new-arrivals", label: "NEW ARRIVALS" },
  { to: "/best-sellers", label: "BEST SELLERS" },
  { to: "/deals", label: "DEALS", accent: true },
];

const TabletNavDrawer = ({
  isOpen,
  onClose,
  setIsSearchOpen,
  setIsAuthOpen,
}) => {
  const { pathname, search } = useLocation();
  const user = useUser();
  const { areas = [] } = useGetAllProductAreas();
  const cart = getCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ tabletNav: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-9998 hidden md:block lg:hidden"
          />

          {/* Drawer */}
          <Motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 left-0 bottom-0 z-9999 w-72 bg-[#fffaf5] shadow-2xl hidden md:flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link to="/" onClick={onClose} aria-label="Go to homepage">
                <img src={logo} alt={"Logo"} className="w-24 h-auto" />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent/10 text-accent font-semibold"
                            : link.accent
                              ? "text-accent hover:bg-accent/5"
                              : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {areas.length > 0 && (
                <>
                  <div className="mx-4 my-3 border-t border-gray-100" />
                  <ul className="space-y-1 px-3">
                    <li className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Shop by Area
                    </li>
                    {areas.map((area) => {
                      const areaUrl = `/shop?area=${encodeURIComponent(area.name)}`;
                      const isActive =
                        pathname === "/shop" &&
                        search.includes(
                          `area=${encodeURIComponent(area.name)}`,
                        );
                      return (
                        <li key={area._id}>
                          <Link
                            to={areaUrl}
                            onClick={onClose}
                            className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-accent/10 text-accent font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {area.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-4.5 h-4.5" />
                Search
              </button>

              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4.5 h-4.5" />
                Wishlist
              </Link>

              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <img src={cartIcon} alt="Cart" className="w-4.5 h-auto" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                Cart
              </Link>

              {user ? (
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {user.profileImg?.url ? (
                    <img
                      src={user.profileImg.url}
                      alt="Profile"
                      className="w-4.5 h-4.5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-bold text-[10px]">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  Profile
                </Link>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4.5 h-4.5" />
                  Login
                </button>
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TabletNavDrawer;
