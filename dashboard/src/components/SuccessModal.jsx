import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/successfulCheck.json";

const SuccessModal = ({
  open = false,
  message = "Deleted successfully!",
  onClose,
  duration = 1500,
}) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-[999999] flex items-center justify-center backdrop-blur-sm bg-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="w-[90%] max-w-lg rounded-xl shadow-xl py-6 flex flex-col items-center justify-center bg-[#fafafa] border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-32 h-32"
            >
              <Lottie animationData={successAnimation} loop={false} />
            </Motion.div>

            <h2 className="text-3xl font-semibold -mt-5 text-gray-900">
              Success
            </h2>

            <p className="text-center text-md text-gray-900">{message}</p>

            <button
              onClick={onClose}
              className="mt-5 px-10 py-1.5 cursor-pointer rounded-full transition-all font-medium bg-purple-500 hover:bg-purple-600 text-white"
            >
              Close
            </button>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
