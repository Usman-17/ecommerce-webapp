import { useState, useRef } from "react";

import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";

import logo from "../assets/logo.webp";
import home from "../assets/home.webp";
import inbox from "../assets/inbox.webp";
import tracking from "../assets/tracking.webp";
import collection from "../assets/products.webp";

import SearchModal from "./SearchModal";
import ProfileDropdown from "./ProfileDropdown";
import { UserRound } from "lucide-react";
import useGetAuth from "../hooks/useGetAuth";

// Imports End

const Header = () => {
  const { data: authUser } = useGetAuth();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);

  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <div className="px-1 sm:px-[5vw] md:px-[1vw] xl:px-[0.5vw] 2xl:xl:px-[1vw]">
      <div className="flex items-center justify-between py-2 font-medium">
        <Link to={"/"}>
          <img
            src={logo}
            alt="jemzy.pk"
            className="w-20 sm:w-24"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* NavLinks */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>ALL PRODUCTS</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-4 sm:gap-5 justify-center">
          {/* Search  */}
          <div>
            <Search
              className="cursor-pointer hover:text-red-600 transition-colors duration-150"
              onClick={toggleSearchBar}
              aria-expanded={isSearchVisible}
              aria-label="Toggle Search Bar"
            />

            {isSearchVisible && (
              <div ref={searchRef}>
                <SearchModal onClose={() => setIsSearchVisible(false)} />
              </div>
            )}
          </div>

          <ProfileDropdown />

          {/* Cart  */}
          <Link to="/cart" className="relative">
            <ShoppingBag />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {authUser?.cartData
                ? Object.values(authUser.cartData).reduce((acc, product) => {
                    if (typeof product === "number") {
                      return acc + product;
                    }

                    return (
                      acc +
                      Object.values(product).reduce(
                        (total, qty) => total + qty,
                        0
                      )
                    );
                  }, 0)
                : 0}
            </p>
          </Link>
        </div>

        {/* Bottom Navigation (visible on small screens) */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fffaf5] shadow-md sm:hidden px-2 border-t border-[#fffaf1] py-1">
          <ul className="flex justify-around items-center h-12 text-gray-600">
            <NavLink
              to="/"
              className="flex items-center gap-1 text-black"
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              <div className="flex items-center gap-1">
                <img src={home} alt="home" className="w-7" />
                <p className="hidden mt-1.5 text-md">Home</p>
              </div>
            </NavLink>

            <NavLink
              to="/collection"
              className="flex items-center gap-1 text-gray-700 hover:text-black"
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              <img src={collection} alt="collection" className="w-7" />
              <p className="hidden mt-1.5 text-md">ALL PRODUCTS</p>
            </NavLink>

            {authUser ? (
              <NavLink
                to="/order"
                className="flex items-center gap-1 text-gray-700 hover:text-black"
                onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
              >
                <img src={tracking} alt="order" className="w-8" />
                <p className="hidden mt-1.5 text-md">Orders</p>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-black"
                onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
              >
                <UserRound size={24} />
                <p className="hidden mt-1.5 text-md">Login</p>
              </NavLink>
            )}

            <NavLink
              to="/contact"
              className="flex items-center gap-1 text-gray-700 hover:text-black"
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              <img src={inbox} alt="contact" className="w-7" />
              <p className="hidden mt-1.5 text-md">Contact</p>
            </NavLink>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
