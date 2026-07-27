import LoadingSpinner from "./LoadingSpinner";

const ModalActionButtons = ({
  onCancel,
  onSubmit,
  onSaveAndClose,
  isDarkMode,
  isSubmitting = false,
  isSavingAndClosing = false,
  isDisabled = false,
  submitText = "Save",
  saveAndCloseText = "Save & Close",
  loadingText = "Saving...",
  className = "",
}) => {
  return (
    <div
      className={`mt-6 flex flex-wrap items-center justify-end gap-2 ${className}`}
    >
      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className={`px-5 h-10 sm:h-9 min-w-25 sm:min-w-0 rounded-full text-sm font-medium transition-all duration-200 outline-none ${
          isDarkMode
            ? "text-gray-300 hover:bg-white/10"
            : "text-gray-700 hover:bg-gray-100"
        } focus-visible:ring-(--secondary-color)/30 focus-visible:ring-2 active:scale-95`}
      >
        Cancel
      </button>

      {/* Save & Close Button */}
      {onSaveAndClose && (
        <button
          type="button"
          onClick={onSaveAndClose}
          disabled={isDisabled || isSubmitting || isSavingAndClosing}
          className={`px-4 sm:px-6 h-10 sm:h-9 min-w-25 sm:min-w-0 rounded-full text-white text-sm font-medium transition-all duration-200 outline-none ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "focus-visible:ring-2"
          } ${
            isSavingAndClosing
              ? "bg-green-700 cursor-not-allowed shadow-inner"
              : `bg-green-700 hover:bg-green-600 active:scale-95 ${
                  isDarkMode
                    ? "focus-visible:ring-green-400/50"
                    : "focus-visible:ring-green-500/50"
                }`
          }`}
        >
          {isSavingAndClosing ? (
            <LoadingSpinner content={loadingText} />
          ) : (
            saveAndCloseText
          )}
        </button>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled || isSubmitting || isSavingAndClosing}
        className={`px-4 sm:px-6 h-10 sm:h-9 min-w-27.5 sm:min-w-0 rounded-full text-white text-sm font-medium transition-all duration-200 outline-none ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "focus-visible:ring-2 active:scale-95"
        } ${isSubmitting ? "cursor-not-allowed" : ""} ${
          isDarkMode
            ? "focus-visible:ring-(--secondary-color)/50"
            : "focus-visible:ring-(--secondary-color)/50"
        }`}
        style={{
          backgroundColor: "var(--secondary-color)",
          filter: isSubmitting ? "brightness(0.8)" : undefined,
          cursor: isDisabled
            ? "not-allowed"
            : isSubmitting
              ? "not-allowed"
              : undefined,
        }}
      >
        {isSubmitting ? <LoadingSpinner content={loadingText} /> : submitText}
      </button>
    </div>
  );
};

export default ModalActionButtons;
