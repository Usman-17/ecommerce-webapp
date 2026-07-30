import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import LoadingSpinner from "./LoadingSpinner";

const CustomDeleteModal = ({
  open,
  onConfirm,
  onCancel,
  loading,
  title,
  message,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (e.key === "Escape") {
        onCancel();
      }

      if (e.key === "Enter" && !loading) {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel, onConfirm, loading]);

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
            className="w-[90%] max-w-md rounded-xl shadow-2xl p-6 transition-colors border bg-white text-gray-900 border-gray-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-(--secondary-color) overflow-hidden text-ellipsis whitespace-nowrap">
              <AlertTriangle className="w-5 h-5 text-(--secondary-color) shrink-0" />
              {title}
              {title || "Confirm Deletion"}
            </h2>

            <p className="mb-6 text-gray-600">
              {message ? (
                message
              ) : (
                <>
                  Are you sure you want to delete
                  {title ? (
                    <span className="font-bold text-red-500 mx-1 decoration-red-400">
                      &quot;
                      {title.length > 30 ? title.slice(0, 30) + "..." : title}
                      &quot;
                    </span>
                  ) : (
                    " this record"
                  )}
                  ? This action cannot be undone.
                </>
              )}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-5 py-1 text-sm rounded-full border transition cursor-pointer border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-5 py-1 text-sm rounded-full text-white transition cursor-pointer bg-(--secondary-color) ${
                  loading ? "cursor-not-allowed opacity-80" : "hover:opacity-90"
                }`}
              >
                {loading ? (
                  <LoadingSpinner content="Deleting..." />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomDeleteModal;
