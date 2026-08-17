import { useEffect } from "react";
import { X } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { AnimatePresence, motion as Motion } from "framer-motion";

const FullScreenModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  showClose = true,
  actions,
}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className={`w-full h-full bg-white text-gray-800 overflow-y-auto no-scrollbar pointer-events-auto ${
              !isMobileOpen
                ? isExpanded || isHovered
                  ? "lg:ml-[220px]"
                  : "lg:ml-[56px]"
                : ""
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-6 flex flex-col min-h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                  {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                )}
                {actions}
              </div>
              <div className="flex-1">{children}</div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenModal;
