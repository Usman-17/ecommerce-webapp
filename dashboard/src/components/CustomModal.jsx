import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const CustomModal = ({
  isOpen,
  isDarkMode,
  className = "w-[90%] max-w-lg",
  fullScreen = false,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const container = document.getElementById("main-scroll-container");

    const scrollY = window.scrollY;

    if (container) container.style.overflow = "hidden";

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      if (container) container.style.overflow = "";

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className={`fixed inset-0 z-[999999] flex items-center justify-center backdrop-blur-sm ${
            isDarkMode ? "bg-black/50" : "bg-black/20"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Motion.div
            className={`${fullScreen ? "w-full h-full rounded-none" : className} ${fullScreen ? "" : "rounded-xl"} shadow-2xl px-3 py-6 sm:px-6 border overflow-y-auto no-scrollbar ${
              isDarkMode
                ? "bg-[#1A162B] text-white border-white/10"
                : "bg-white text-gray-800 border-gray-200"
            }`}
            initial={{
              opacity: 0,
              scale: fullScreen ? 1 : 0.95,
              y: fullScreen ? 0 : 20,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: fullScreen ? 1 : 0.95,
              y: fullScreen ? 0 : 20,
            }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
