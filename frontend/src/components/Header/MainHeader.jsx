import { useState, useEffect } from "react";
import { Search, Heart, User, Menu } from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";

import logo from "../../assets/logo.webp";
import cartIcon from "../../assets/cart.png";

import SearchModal from "./SearchModal";
import TabletNavDrawer from "./TabletNavDrawer";
import CollectionsDropdown from "./CollectionsDropdown";

import { useUser } from "../../hooks/useUser";

import { getCart } from "../../utils/cartStorage";
// Imports End-----

const MainHeader = ({ isSearchOpen, setIsSearchOpen, setIsAuthOpen }) => {
  const { pathname } = useLocation();
  const user = useUser();

  const [cartCount, setCartCount] = useState(0);
  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const totalCount = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0,
      );
      setCartCount(totalCount);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <div
      className={`-mx-3 px-3 sm:px-[4vw] md:px-[2vw] lg:px-[5vw] ${pathname === "/" ? "bg-[#fbebdf] sm:bg-[linear-gradient(90deg,#f5e9df_0%,#f6ece4_50%,#f2e2d5_100%)] " : " bg-[#fffaf5]  sm:border-b sm:border-gray-200"}`}
    >
      <div className="flex items-center justify-between py-3 sm:py-3.5 lg:py-2 font-medium">
        {/* Hamburger - Tablet only */}
        <button
          onClick={() => setIsTabletNavOpen(true)}
          className="hidden md:flex lg:hidden items-center justify-center hover:bg-[#CC0D39]/5 transition-colors duration-150 rounded-full p-2 mr-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        <Link
          to={"/"}
          className="w-25 sm:w-30 lg:w-30"
          aria-label="Go to homepage"
        >
          <img
            src={logo}
            alt={"Logo"}
            className="w-20 sm:w-24 lg:w-24 h-auto"
          />
        </Link>

        {/* NavLinks - Desktop only */}
        <nav aria-label="Main navigation" className="flex-1">
          <ul className="hidden lg:flex gap-6 text-sm text-gray-700 justify-center font-medium">
            <li>
              <NavLink
                to="/"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span>HOME</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/shop"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span>SHOP</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>

            <CollectionsDropdown />

            <li>
              <NavLink
                to="/new-arrivals"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span>NEW ARRIVALS</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/best-sellers"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span>BEST SELLERS</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/deals"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span className="text-[#CC0D39]">DEALS</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/scoop"
                className="relative flex flex-col items-center group"
              >
                {({ isActive }) => (
                  <>
                    <span>SCOOP</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#CC0D39] transition-all duration-300 ease-in-out ${isActive ? "w-[60%]" : "w-0"} group-hover:w-[60%]`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-0.5 lg:gap-1 ml-auto">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Search"
            className="hover:bg-[#CC0D39]/5 transition-colors duration-150 rounded-full p-2"
          >
            <Search className="cursor-pointer w-5 h-5" />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:flex items-center justify-center hover:bg-[#CC0D39]/5 transition-colors duration-150 rounded-full p-2.5"
            aria-label="Wishlist"
          >
            <Heart className="cursor-pointer w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:bg-[#CC0D39]/5 transition-colors duration-150 rounded-full p-2 mr-0.5 sm:mr-0"
            aria-label={`Cart, ${cartCount} items`}
          >
            <img
              src={cartIcon}
              alt="Cart"
              className="w-5 h-auto cursor-pointer"
            />
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-accent/30">
              {cartCount}
            </span>
          </Link>

          {/* User */}
          {user ? (
            <Link
              to="/profile"
              className="hidden lg:flex items-center justify-center rounded-full overflow-hidden w-9 h-9 hover:opacity-80 transition-opacity duration-200 ml-2"
              aria-label="Your profile"
            >
              {user.logoImageURL ? (
                <img
                  src={user.logoImageURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">
                    {user.partyName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </Link>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden lg:flex items-center justify-center hover:bg-[#CC0D39]/5 transition-colors duration-150 rounded-full p-2.5"
              aria-label="Open login"
            >
              <User className="cursor-pointer w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Tablet Navigation Drawer */}
      <TabletNavDrawer
        isOpen={isTabletNavOpen}
        onClose={() => setIsTabletNavOpen(false)}
        setIsSearchOpen={setIsSearchOpen}
        setIsAuthOpen={setIsAuthOpen}
      />
    </div>
  );
};

export default MainHeader;
