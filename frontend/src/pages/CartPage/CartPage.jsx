import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { validateCoupon } from "../../utils/coupons";
import { getCart, setCart } from "../../utils/cartStorage";

import EmptyCart from "./components/EmptyCart";
import CartSummary from "./components/CartSummary";
import CartItemsList from "./components/CartItemsList";
import CartBulkActionBar from "./components/CartBulkActionBar";
import MobileCartSummary from "./components/MobileCartSummary";
import RecommendedProducts from "../../components/RecommendedProducts";
import useEcommerce from "../../hooks/useEcommerce";
// Imports End-----

const CartPage = () => {
  const { trackViewCart, trackRemoveFromCart } = useEcommerce();

  // Handle Cart Items
  const [cartItems, setCartItems] = useState(() => getCart());

  // Edit Mode & Selection
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appliedCoupon")) || null;
    } catch {
      return null;
    }
  });
  const [couponCode, setCouponCode] = useState(() => appliedCoupon?.code || "");

  useEffect(() => {
    const handleAction = (e) => {
      if (e.detail.path === "/cart") {
        setIsEditMode((prev) => {
          if (prev) setSelectedIndices([]);
          return !prev;
        });
      }
    };
    window.addEventListener("headerActionTriggered", handleAction);
    return () =>
      window.removeEventListener("headerActionTriggered", handleAction);
  }, []);

  // Listen for cart updates from other pages (e.g., ProductPage add-to-cart)
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCart());
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // Reset edit mode when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0 && isEditMode) {
      const timer = setTimeout(() => {
        setIsEditMode(false);
        window.dispatchEvent(new Event("resetHeaderEditMode"));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, isEditMode]);

  const toggleSelect = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSelectAll = () => {
    if (selectedIndices.length === cartItems.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(cartItems.map((_, i) => i));
    }
  };

  const handleBulkDelete = () => {
    const count = selectedIndices.length;
    const updated = cartItems.filter((_, i) => !selectedIndices.includes(i));
    updateCart(updated);
    setSelectedIndices([]);
    setIsEditMode(false);
    window.dispatchEvent(new Event("resetHeaderEditMode"));
    toast.success(`${count} item${count > 1 ? "s" : ""} removed from cart`, {
      id: "cart-bulk-remove",
      duration: 3000,
    });
  };

  const updateCart = (newItems) => {
    setCartItems(newItems);
    setCart(newItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Handle Delete
  const handleDelete = (index) => {
    const removedItem = cartItems[index];
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
    trackRemoveFromCart(removedItem, removedItem.quantity);
    toast.success(
      `"${removedItem?.name?.slice(0, 28)}${removedItem?.name?.length > 28 ? "…" : ""}" removed from cart`,
      { id: "cart-remove", duration: 3000 },
    );
  };

  // Handle Quantity Change
  const handleQuantityChange = (index, delta) => {
    const updated = [...cartItems];
    const item = updated[index];
    const newQuantity = Math.max(1, item.quantity + delta);

    item.quantity = newQuantity;
    item.total = item.price * newQuantity;

    updateCart(updated);
  };

  // Calculate Subtotal, Progress, Shipping Fee, and Total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const FREE_SHIPPING_THRESHOLD = 5000;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const shippingFee =
    subtotal >= FREE_SHIPPING_THRESHOLD ||
    (appliedCoupon?.type === "free_shipping" &&
      subtotal >= appliedCoupon.minSubtotal)
      ? 0
      : 250;
  const total = subtotal + shippingFee;

  const handleApplyCoupon = () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponError("Please enter a coupon code");
      setCouponSuccess("");
      setAppliedCoupon(null);
      return;
    }

    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setCouponError("");
      setCouponSuccess(result.message);
      setAppliedCoupon(result.coupon);
      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({ ...result.coupon, code }),
      );
    } else {
      setCouponError(result.message);
      setCouponSuccess("");
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
    }
  };

  // Scroll To Top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Track view_cart on page load
  useEffect(() => {
    if (cartItems.length > 0) {
      trackViewCart(cartItems, subtotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen -mt-1 sm:mt-0">
      <div
        className={`sm:px-[4vw] sm:py-4 ${
          cartItems.length > 0 ? "pb-20 lg:pb-0" : ""
        }`}
      >
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4">
            {/* Select All Row (mobile edit mode only) */}
            <AnimatePresence>
              {isEditMode && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="lg:col-span-8 flex items-center justify-between px-2 mb-1 md:hidden"
                >
                  <button
                    onClick={handleSelectAll}
                    className="text-[13px] font-bold text-primary flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full active:scale-95 transition-all"
                  >
                    {selectedIndices.length === cartItems.length
                      ? "Deselect All"
                      : "Select All"}
                    <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                      {selectedIndices.length}
                    </span>
                  </button>
                  <p className="text-[12px] text-gray-400 font-medium italic">
                    {cartItems.length} Items total
                  </p>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="lg:col-span-8 space-y-2 sm:space-y-4 sm:bg-white sm:rounded-xl sm:border sm:border-gray-100 sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-6">
              <div className="hidden sm:flex items-start justify-between px-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-playfair">
                    Your Cart ({cartItems.length})
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "🎉 You've unlocked free shipping!"
                      : `Almost there! Add Rs. ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-US", { maximumFractionDigits: 0 })} more to get free shipping.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    updateCart([]);
                    setCouponCode("");
                    setCouponError("");
                    setCouponSuccess("");
                    setAppliedCoupon(null);
                    localStorage.removeItem("appliedCoupon");
                    toast.success("Cart cleared", {
                      id: "cart-clear",
                      duration: 2000,
                    });
                  }}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-semibold transition-colors mt-1 shrink-0"
                >
                  Clear Cart
                </button>
              </div>
              <p className="sm:hidden text-xs text-gray-500 px-1">
                {subtotal >= FREE_SHIPPING_THRESHOLD
                  ? "🎉 You've unlocked free shipping!"
                  : ""}
              </p>
              <CartItemsList
                cartItems={cartItems}
                handleDelete={handleDelete}
                handleQuantityChange={handleQuantityChange}
                isEditMode={isEditMode}
                selectedIndices={selectedIndices}
                onToggleSelect={toggleSelect}
              />
            </div>

            <CartSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD}
              progress={progress}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              couponSuccess={couponSuccess}
              onApplyCoupon={handleApplyCoupon}
            />
          </div>
        )}

        <div className="mt-6 sm:mt-10">
          <RecommendedProducts title="You may be interested in…" limit={30} />
        </div>
      </div>

      {/* Mobile Summary — hide when in edit mode with items selected */}
      {cartItems.length > 0 && !isEditMode && (
        <MobileCartSummary
          cartItems={cartItems}
          total={total}
          subtotal={subtotal}
          shippingFee={shippingFee}
        />
      )}

      {/* Bulk Delete Bar */}
      <CartBulkActionBar
        isEditMode={isEditMode}
        selectedCount={selectedIndices.length}
        onDelete={handleBulkDelete}
      />
    </div>
  );
};

export default CartPage;
