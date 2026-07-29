import LottieComponent from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  TruckElectric,
  ArrowRight,
} from "lucide-react";

import { getCart, setCart } from "../utils/cartStorage";
import { vibrate, deleteVibrate } from "../utils/vibrate";

import emptyCartAnimation from "../assets/lottie/EmptyBox.json";
// Imports End-----

const Lottie = LottieComponent?.default || LottieComponent;

const FREE_SHIPPING_THRESHOLD = 5000;

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => getCart());
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef(null);
  const cartVersionRef = useRef(0);

  const loadCart = useCallback(() => {
    setCartItems(getCart());
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      cartVersionRef.current += 1;
      loadCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [loadCart]);

  useEffect(() => {
    const handleOpen = () => {
      loadCart();
      setShowSuccess(true);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 3000);
    };
    window.addEventListener("openCartDrawer", handleOpen);
    return () => {
      window.removeEventListener("openCartDrawer", handleOpen);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [loadCart]);

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

  const updateCart = (newItems) => {
    setCartItems(newItems);
    setCart(newItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (index, delta) => {
    vibrate(5);
    const updated = [...cartItems];
    const newQty = updated[index].quantity + delta;
    if (newQty < 1) return;
    updated[index] = {
      ...updated[index],
      quantity: newQty,
      total: updated[index].price * newQty,
    };
    updateCart(updated);
  };

  const handleDelete = (index) => {
    deleteVibrate();
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const total = subtotal + shippingFee;
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-50 hidden sm:block"
            onClick={onClose}
          />

          {/* Drawer */}
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl hidden sm:flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                Your Cart ({totalCount})
              </h2>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={() => updateCart([])}
                    className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <Motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-3 rounded-lg border border-green-200">
                    <span className="text-green-500 text-lg">&#10003;</span>
                    Product added to cart successfully!
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-36 h-36 mb-4">
                    <Lottie animationData={emptyCartAnimation} loop={false} />
                  </div>
                  <p className="text-gray-500 font-semibold mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 text-sm">
                    Add items to get started
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.packId}-${JSON.stringify(item.selectedOptions)}-${index}`}
                    className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-xs"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.productSlug}`}
                      onClick={onClose}
                      className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.variantImage || item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.productSlug}`}
                          onClick={onClose}
                          className="text-sm font-semibold text-gray-900 hover:text-accent line-clamp-1 truncate"
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* Variants */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.selectedVariants?.map((v, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-gray-500 font-medium bg-gray-50 px-1.5 py-0.5 rounded"
                          >
                            {v.detailName}
                          </span>
                        ))}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-full p-1 border border-gray-200/60">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                handleDelete(index);
                              } else {
                                handleQuantityChange(index, -1);
                              }
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 size={11} className="text-red-500" />
                            ) : (
                              <Minus size={11} strokeWidth={2.5} />
                            )}
                          </button>

                          <span className="w-7 text-center text-xs font-bold text-gray-900 select-none">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 transition-all"
                          >
                            <Plus size={11} strokeWidth={2.5} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-accent block">
                            Rs{" "}
                            {item.total?.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}
                          </span>

                          <span className="text-[10px] text-gray-400 font-medium ">
                            Rs{" "}
                            {item.price?.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}{" "}
                            each
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                {/* Free Shipping Bar */}
                {remaining > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <TruckElectric size={20} className="text-green-600" />
                      </div>
                      <span className="text-[13px] font-bold text-gray-900 flex-1">
                        Add Rs{" "}
                        <span className="text-accent">
                          {remaining.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                        </span>{" "}
                        more for Free Shipping
                      </span>
                      <span className="text-[12px] font-bold text-gray-400 shrink-0">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-xl px-3 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <TruckElectric size={20} className="text-green-600" />
                    </div>
                    <span className="text-[13px] font-bold text-green-700">
                      You qualify for FREE delivery!
                    </span>
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-gray-900">
                      Rs{" "}
                      {subtotal.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span
                      className={`font-bold ${shippingFee === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {shippingFee === 0 ? "Free" : `Rs ${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-gray-900 text-lg">
                      Rs{" "}
                      {total.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  onClick={() => {
                    onClose();
                    navigate("/cart");
                  }}
                  className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  View Cart
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate("/place-order");
                  }}
                  className="w-full py-3 rounded-lg bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
