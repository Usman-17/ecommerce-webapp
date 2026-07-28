import { motion as Motion, AnimatePresence } from "framer-motion";

import heart from "../assets/mobile_menu/heart.png";
import heartFill from "../assets/mobile_menu/heart-fill.png";
// Imports End-------

const WishlistButton = ({ isLiked, onToggle, className = "" }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`relative group flex items-center justify-center p-2 rounded-full transition-all duration-300 focus:outline-none active:scale-95 ${className}`}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <AnimatePresence>
        {isLiked && (
          <Motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-red-500/30 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLiked && (
          <>
            <Motion.span
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="absolute w-3 h-3 bg-red-400 rounded-full blur-[2px] pointer-events-none"
              style={{ top: "0%", left: "50%" }}
            />
            <Motion.span
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute w-2 h-2 bg-red-400 rounded-full blur-[1px] pointer-events-none"
              style={{ bottom: "10%", right: "10%" }}
            />
            <Motion.span
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute w-2 h-2 bg-pink-400 rounded-full blur-[1px] pointer-events-none"
              style={{ bottom: "10%", left: "10%" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Heart Icon */}
      <Motion.div
        animate={
          isLiked
            ? {
                scale: [1, 1.4, 0.9, 1.1, 1],
                transition: {
                  duration: 0.4,
                  type: "tween",
                  ease: "easeInOut",
                },
              }
            : { scale: 1 }
        }
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-10"
      >
        <img
          src={isLiked ? heartFill : heart}
          alt="heart"
          className="w-4 h-4 object-contain transition-all duration-300"
          style={{
            filter: isLiked
              ? "invert(27%) sepia(91%) saturate(2351%) hue-rotate(346deg) brightness(104%) contrast(97%)"
              : "invert(80%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)",
          }}
        />
      </Motion.div>
    </button>
  );
};

export default WishlistButton;
