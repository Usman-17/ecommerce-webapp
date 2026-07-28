import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search } from "lucide-react";

import cartIcon from "../../assets/cart.png";

import { vibrate } from "../../utils/vibrate";
import { getCart } from "../../utils/cartStorage";

const MobileHeader = ({
  title,
  onEdit,
  isEditMode,
  onSearch,
  onAdd,
  showCart,
}) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="bg-primary w-full md:hidden pt-[env(safe-area-inset-top)]">
      <div className="relative flex items-center justify-between px-4 py-3 text-white min-h-14">
        <button
          onClick={handleBack}
          className="p-2 rounded-full active:scale-95 active:bg-black/5 transition-all"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-center whitespace-nowrap pointer-events-none">
          {title}
        </h1>

        <div className="flex items-center gap-1">
          {onAdd ? (
            <button
              onClick={() => {
                vibrate(1);
                onAdd();
              }}
              className="p-2 rounded-full active:scale-95 active:bg-black/5 transition-all"
              aria-label="Add new item"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          ) : onSearch ? (
            <button
              onClick={() => {
                vibrate(1);
                onSearch();
              }}
              className="p-2 rounded-full active:scale-95 active:bg-black/5 transition-all"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
          ) : showCart ? (
            <button
              onClick={() => {
                vibrate(1);
                navigate("/cart");
              }}
              className="relative p-2 rounded-full active:scale-95 active:bg-black/5 transition-all overflow-visible"
              aria-label={`Cart, ${cartCount} items`}
            >
              <img
                src={cartIcon}
                alt="Cart"
                className="w-5 h-auto brightness-0 invert"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-accent/30">
                  {cartCount}
                </span>
              )}
            </button>
          ) : (
            <div className="w-8" />
          )}

          {onEdit && (
            <button
              onClick={() => {
                vibrate(1);
                onEdit();
              }}
              className="text-[15px] font-semibold text-white active:scale-95 transition-all min-w-10 text-right"
            >
              {isEditMode ? "Done" : "Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#fffaf5] h-4 rounded-t-[15px] w-full" />
    </header>
  );
};

export default MobileHeader;
