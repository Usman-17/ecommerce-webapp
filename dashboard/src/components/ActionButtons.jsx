import { Loader, Settings, SquarePen, Trash2 } from "lucide-react";

const ActionButtons = ({
  record,
  isEditLoading = false,
  isDeleteLoading = false,
  isSettingsLoading = false,
  editDisabled = false,
  deleteDisabled = false,
  onEdit,
  onDelete,
  onSettings,
  darkMode = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Settings Button */}
      {onSettings && (
        <button
          title="Settings"
          onClick={() => onSettings(record)}
          disabled={isSettingsLoading}
          className={`p-2 rounded-full border transition-all duration-200 shadow-sm flex items-center justify-center outline-none active:scale-90 ${
            darkMode
              ? "bg-[#1a1129] border-[#3b1f5a] text-green-400 hover:enabled:bg-[#2a1b44] hover:enabled:text-green-300"
              : "bg-white border-gray-300 text-green-600 hover:enabled:bg-green-50 hover:enabled:text-green-500"
          } ${
            isSettingsLoading
              ? "opacity-75 !cursor-not-allowed !pointer-events-auto"
              : "cursor-pointer"
          }`}
          style={{ cursor: isSettingsLoading ? "not-allowed" : "pointer" }}
        >
          {isSettingsLoading ? (
            <Loader
              className={`size-4 shrink-0 animate-spin ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
          ) : (
            <Settings size={16} />
          )}
        </button>
      )}

      {/* Edit Button */}
      {onEdit && (
        <button
          title="Edit"
          onClick={() => !editDisabled && onEdit(record)}
          disabled={isEditLoading || editDisabled}
          className={`p-2 rounded-full border transition-all duration-200 shadow-sm flex items-center justify-center outline-none active:scale-90 ${
            darkMode
              ? "bg-[#1a1129] border-(--secondary-color)/30 text-(--secondary-color) hover:enabled:bg-[color-mix(in_srgb,var(--secondary-color)_15%,transparent)]"
              : "bg-white border-gray-300 text-(--secondary-color) hover:enabled:bg-[color-mix(in_srgb,var(--secondary-color)_8%,transparent)]"
          } ${
            isEditLoading || editDisabled
              ? "opacity-50 !cursor-not-allowed !pointer-events-auto"
              : "cursor-pointer"
          }`}
          style={{
            cursor: isEditLoading || editDisabled ? "not-allowed" : "pointer",
          }}
        >
          {isEditLoading ? (
            <Loader
              className={`size-4 shrink-0 animate-spin ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
          ) : (
            <SquarePen size={16} />
          )}
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          title="Delete"
          onClick={() => !deleteDisabled && onDelete(record)}
          disabled={isDeleteLoading || deleteDisabled}
          className={`p-2 rounded-full border transition-all duration-200 shadow-sm flex items-center justify-center outline-none active:scale-90 ${
            darkMode
              ? "bg-[#1a1129] border-[#5a1f1f] text-red-500 hover:enabled:text-red-400"
              : "bg-white border-gray-300 text-red-600 hover:enabled:bg-red-50 hover:enabled:text-red-500"
          } ${
            isDeleteLoading || deleteDisabled
              ? "opacity-50 !cursor-not-allowed !pointer-events-auto"
              : "cursor-pointer"
          }`}
          style={{
            cursor:
              isDeleteLoading || deleteDisabled ? "not-allowed" : "pointer",
          }}
        >
          {isDeleteLoading ? (
            <Loader
              className={`size-4 shrink-0 animate-spin ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
