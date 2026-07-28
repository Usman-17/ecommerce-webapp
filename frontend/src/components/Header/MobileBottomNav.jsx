import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { vibrate } from "../../utils/vibrate";

import home from "../../assets/mobile_menu/home.webp";
import homeFill from "../../assets/mobile_menu/home-fill.png";

import products from "../../assets/mobile_menu/category.png";
import productsFill from "../../assets/mobile_menu/category-fill.png";

import like from "../../assets/mobile_menu/heart.png";
import likeFill from "../../assets/mobile_menu/heart-fill.png";

import userIcon from "../../assets/mobile_menu/user.png";
import userFill from "../../assets/mobile_menu/user-fill.png";

import scoopIcon from "../../assets/mobile_menu/sparkle.png";
import scoopFill from "../../assets/mobile_menu/sparkle-fill.png";
// Imports End----

const MobileBottomNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;

          if (Math.abs(scrollDelta) > 5) {
            setIsVisible(scrollDelta < 0);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-100 bg-[#fcf9f8] border-t border-[#fff9f7] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe transform ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex justify-between items-center h-16 px-2">
        <NavItem
          to="/"
          iconImage={home}
          activeIconImage={homeFill}
          label="Home"
        />

        <NavItem
          to="/category"
          iconImage={products}
          activeIconImage={productsFill}
          label="Categories"
        />

        <NavItem
          to="/scoop"
          iconImage={scoopIcon}
          activeIconImage={scoopFill}
          label="Scoop"
        />

        <NavItem
          to="/wishlist"
          iconImage={like}
          activeIconImage={likeFill}
          label="Wishlist"
        />
        <NavItem
          to="/profile"
          iconImage={userIcon}
          activeIconImage={userFill}
          label="My Account"
          activePaths={[
            "/profile",
            "/profile/orders",
            "/track-order",
            "/address",
            "/help-center",
            "/contact-us",
            "/about-us",
            "/faqs",
            "/shipping-policy",
          ]}
        />
      </ul>
    </nav>
  );
};

const NavItem = ({
  to,
  iconImage,
  activeIconImage,
  iconComponent,
  label,
  activePaths = [],
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || activePaths.includes(pathname);

  return (
    <li className="relative flex-1">
      <NavLink
        to={to}
        onClick={() => {
          vibrate(15);
          if (isActive) window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex flex-col items-center justify-center w-full h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CC0D39]"
        aria-current={isActive ? "page" : undefined}
      >
        <div className="relative flex flex-col items-center justify-center gap-1 transition-all">
          <div className="shrink-0 flex items-center justify-center w-5.5 h-5.5 relative">
            {iconImage ? (
              <>
                <img
                  src={iconImage}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${isActive ? "opacity-0" : "opacity-60"}`}
                />
                {activeIconImage && (
                  <img
                    src={activeIconImage}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`}
                  />
                )}
              </>
            ) : (
              <div
                className={`transition-all duration-150 ${
                  isActive
                    ? "opacity-100 text-gray-900"
                    : "opacity-60 text-gray-500 group-hover:text-gray-600"
                }`}
              >
                {iconComponent}
              </div>
            )}
          </div>

          <span
            className={`text-[11px] font-bold tracking-wide transition-colors duration-150 ${isActive ? "text-gray-900" : "text-gray-500"}`}
          >
            {label}
          </span>
        </div>
      </NavLink>
    </li>
  );
};

export default MobileBottomNav;
