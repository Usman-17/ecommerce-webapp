import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MainHeader from "./MainHeader";
import SearchModal from "./SearchModal";
import AuthModal from "../AuthModal";

import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

import { getCart } from "../../utils/cartStorage";

import { useWishlist } from "../../hooks/useWishlist";
// Imports End-----

const Header = () => {
  const navigate = useNavigate();

  const { wishlist } = useWishlist();

  const [cartItems, setCartItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  const isProductPage = location.pathname.startsWith("/product/");

  // Sync Cart Items for empty check
  useEffect(() => {
    const updateCart = () => {
      const items = getCart();
      setCartItems(items);
    };
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  // Pages that should show mobile page header instead of main header
  const pagesWithMobileHeader = [
    "/wishlist",
    "/cart",
    "/profile/orders",
    "/order-details",
    "/place-order",
    "/track-order",
    "/profile/addresses",
    "/profile/address/edit",
    "/contact-us",
    "/faqs",
    "/shipping-policy",
    "/privacy-policy",
    "/about-us",
    "/category",
    "/brands",
    "/shop",
    "/recently-viewed",
    "/reviews",
    "/help",
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/profile/info",
    "/profile/security",
  ];

  // Check if current page should show mobile header
  const showMobileHeader = pagesWithMobileHeader.includes(location.pathname);

  // Determine if Edit button should be shown (based on content)
  const hasItems =
    location.pathname === "/cart"
      ? cartItems.length > 0
      : location.pathname === "/wishlist"
        ? wishlist.length > 0
        : false;

  // Page titles for mobile header
  const pageTitles = {
    "/wishlist": "Wishlist",
    "/cart": "My Cart",
    "/place-order": "Checkout",
    "/profile/orders": "My Orders",
    "/order-details": "Order Details",
    "/track-order": "Track Order",
    "/profile/addresses": "Address Book",
    "/profile/address/edit": "Add Address",
    "/contact-us": "Contact Us",
    "/faqs": "FAQs",
    "/shipping-policy": "Shipping Policy",
    "/privacy-policy": "Privacy Policy",
    "/about-us": "About Us",
    "/category": "Categories",
    "/brands": "Brands",
    "/shop": "Shop",
    "/recently-viewed": "Recently Viewed",
    "/reviews": "My Reviews",
    "/help": "Help Center",
    "/login": "Login",
    "/signup": "Signup",
    "/forgot-password": "Forgot Password",
    "/reset-password": "Reset Password",
    "/profile/info": "Update Profile",
    "/profile/security": "Update Password",
  };

  const currentTitle = pageTitles[location.pathname] || "Page";

  const [prevPath, setPrevPath] = useState(location.pathname);

  // Reset edit mode on route change during render to avoid cascading effects
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsEditMode(false);
  }

  // Listen for reset event from pages
  useEffect(() => {
    const handleReset = () => setIsEditMode(false);
    window.addEventListener("resetHeaderEditMode", handleReset);
    return () => window.removeEventListener("resetHeaderEditMode", handleReset);
  }, []);

  // Generic action handler
  const handleHeaderAction = () => {
    setIsEditMode((prev) => !prev);
    window.dispatchEvent(
      new CustomEvent("headerActionTriggered", {
        detail: { path: location.pathname },
      }),
    );
  };

  // Prevent Background Scroll when Search Modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Mobile Page Header - Only on specific pages */}
      {showMobileHeader && (
        <div className="md:hidden -mx-3" aria-label="Mobile header">
          <MobileHeader
            title={currentTitle}
            onEdit={
              location.pathname === "/wishlist"
                ? wishlist.length > 0
                  ? handleHeaderAction
                  : null
                : hasItems
                  ? handleHeaderAction
                  : null
            }
            isEditMode={isEditMode}
            onAdd={
              location.pathname === "/profile/addresses"
                ? () => navigate("/profile/address/edit")
                : null
            }
            showCart={
              location.pathname === "/wishlist"
                ? wishlist.length === 0
                : location.pathname === "/shipping-policy" ||
                  location.pathname === "/contact-us" ||
                  location.pathname === "/faqs" ||
                  location.pathname === "/about-us" ||
                  location.pathname === "/order-details" ||
                  location.pathname === "/track-order" ||
                  location.pathname === "/help" ||
                  location.pathname === "/login" ||
                  location.pathname === "/signup" ||
                  location.pathname === "/forgot-password" ||
                  location.pathname === "/reset-password"
            }
            onSearch={
              location.pathname === "/order-details" ||
              location.pathname === "/wishlist" ||
              location.pathname === "/place-order" ||
              location.pathname === "/track-order" ||
              location.pathname === "/profile/addresses" ||
              location.pathname === "/profile/address/edit" ||
              location.pathname === "/contact-us" ||
              location.pathname === "/faqs" ||
              location.pathname === "/shipping-policy" ||
              location.pathname === "/about-us" ||
              location.pathname === "/help" ||
              location.pathname === "/login" ||
              location.pathname === "/signup" ||
              location.pathname === "/forgot-password" ||
              location.pathname === "/reset-password" ||
              (location.pathname === "/cart" && cartItems.length > 0)
                ? null
                : () => setIsSearchOpen(true)
            }
          />
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden md:block" aria-label="Desktop header">
        <header className="w-full flex flex-col relative z-40 bg-white">
          <MainHeader
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            setIsAuthOpen={setIsAuthOpen}
          />
        </header>
      </div>

      {/* Main Header Sticky Reveal (Desktop only) */}
      {/* <div
        className={`block md:hidden fixed px-2.5 top-0 left-0 w-full z-1000 transform transition-transform duration-300
          ${isStickyVisible && !isSearchOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <MainHeader
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      </div> */}

      {/* Mobile Header - Show main header for pages without mobile page header */}
      {!showMobileHeader && (
        <div className="md:hidden" aria-label="Mobile header">
          <header className="w-full flex flex-col relative z-40">
            <MainHeader
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
          </header>
        </div>
      )}

      {!isProductPage &&
        location.pathname !== "/order-details" &&
        location.pathname !== "/place-order" &&
        location.pathname !== "/about-us" &&
        location.pathname !== "/contact-us" &&
        location.pathname !== "/faqs" &&
        location.pathname !== "/profile/info" &&
        location.pathname !== "/profile/security" &&
        location.pathname !== "/shipping-policy" &&
        location.pathname !== "/privacy-policy" &&
        location.pathname !== "/recently-viewed" &&
        location.pathname !== "/profile/addresses" &&
        location.pathname !== "/profile/address/edit" &&
        location.pathname !== "/reviews" &&
        !location.pathname.startsWith("/address") &&
        !(
          isEditMode &&
          (location.pathname === "/cart" || location.pathname === "/wishlist")
        ) && <MobileBottomNav />}

      {/* Search Modal for Mobile Header pages */}
      {showMobileHeader && (
        <div className="md:hidden">
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;
