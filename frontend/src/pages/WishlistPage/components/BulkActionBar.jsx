import { Trash2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { deleteVibrate } from "../../../utils/vibrate";
// Imports End-----

const BulkActionBar = ({ isEditMode, selectedCount, onDelete }) => {
  return (
    <AnimatePresence>
      {isEditMode && selectedCount > 0 && (
        <Motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 md:hidden z-1001"
        >
          <button
            onClick={() => {
              deleteVibrate();
              onDelete();
            }}
            className="w-full bg-red-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-red-100"
          >
            <Trash2 size={20} />
            Delete Selected ({selectedCount})
          </button>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBar;
