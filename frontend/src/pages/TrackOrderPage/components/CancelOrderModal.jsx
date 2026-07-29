import { useEffect } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { deleteVibrate } from "../../../utils/vibrate";
// Imports End------

const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  remarks,
  setRemarks,
  isPending,
}) => {
  // Scroll-lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Intercept mobile hardware back button — close modal instead of navigating away
  useEffect(() => {
    if (!isOpen) return;

    history.pushState({ modal: "cancel-order" }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (history.state?.modal === "cancel-order") {
        history.back();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} />
              </div>

              <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be
              undone. Please provide a reason for cancellation below.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Reason for cancellation
              </label>

              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g., Changed my mind, Ordered wrong item..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all min-h-32 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-12 rounded-full border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              No, Keep it
            </button>

            <button
              onClick={() => {
                onConfirm();
                deleteVibrate();
              }}
              disabled={isPending || !remarks.trim()}
              className="flex-1 h-12 rounded-full bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CancelOrderModal;
