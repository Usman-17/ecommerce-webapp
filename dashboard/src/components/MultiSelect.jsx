import { Select } from "antd";
import { GripVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTheme } from "../ThemeProvider";
// Imports End----

const DraggableTag = (props) => {
  const { label, value, closable, onClose } = props;
  const { isDarkMode } = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value ?? "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 px-2 py-0.5 m-0.5 rounded-md border text-xs font-medium transition-colors ${
        isDarkMode
          ? "border-[var(--secondary-color)]/50 text-[var(--secondary-color)]"
          : "border-[var(--secondary-color)]/30 text-[var(--secondary-color)]"
      }`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[var(--secondary-color)] transition-colors p-1 -ml-1"
        onPointerDown={(e) => {
          e.stopPropagation();
          listeners.onPointerDown(e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (listeners.onMouseDown) listeners.onMouseDown(e);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (listeners.onClick) listeners.onClick(e);
        }}
      >
        <GripVertical size={12} />
      </div>

      <span className="truncate max-w-[120px]">{label}</span>
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
          className="ml-1 hover:text-red-500 transition-colors font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  onReorder,
  placeholder = "Select an option",
  mode = "multiple",
  disabled = false,
  className = "",
  required = false,
  id,
  loading = false,
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const historyPushed = useRef(false);
  const selectRef = useRef(null);

  const closeDropdown = () => {
    setIsOpen(false);
    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const onPopState = () => {
      closeDropdown();
      historyPushed.current = false;
    };

    if (!historyPushed.current) {
      historyPushed.current = true;
      window.history.pushState({ dropdownOpen: true }, "");
    }

    const preventPageScroll = (e) => {
      if (e.target.closest(".ant-select-dropdown")) return;
      e.preventDefault();
    };

    document.addEventListener("touchmove", preventPageScroll, {
      passive: false,
    });
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("touchmove", preventPageScroll);
      window.removeEventListener("popstate", onPopState);
      if (historyPushed.current) {
        historyPushed.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = value.indexOf(active.id);
      const newIndex = value.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(value, oldIndex, newIndex));
      }
    }
  };

  const handleSelectChange = (values) => {
    if (values.includes("SELECT_ALL")) {
      if (value.length === options.length) {
        onChange([]);
      } else {
        onChange(options.map((opt) => opt.value));
      }
      return;
    }
    onChange(values);
  };

  const finalOptions =
    mode === "multiple" && options.length > 0
      ? [
          {
            label:
              value?.length === options.length ? "Deselect All" : "Select All",
            value: "SELECT_ALL",
            className:
              "select-all-option font-bold !text-[var(--secondary-color)]",
          },
          ...options,
        ]
      : options;

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(value || []).filter((v) => v != null)}
          strategy={horizontalListSortingStrategy}
        >
          <Select
            ref={selectRef}
            id={id}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled || loading}
            value={value}
            onChange={handleSelectChange}
            options={finalOptions}
            tagRender={(props) => <DraggableTag {...props} />}
            className={`w-full premium-antd-select ${isDarkMode ? "dark-select" : ""}`}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            maxTagCount="responsive"
            dropdownStyle={{ borderRadius: "12px", zIndex: 9999 }}
            popupClassName="!z-[9999]"
            loading={loading}
            onOpenChange={(visible) => setIsOpen(visible)}
          />
        </SortableContext>
      </DndContext>

      <style>{`
        .premium-antd-select .ant-select-selector {
          border-radius: 6px !important;
          padding: 5px 4px !important;
          min-height: 42px !important;
          user-select: none;
          background-color: ${isDarkMode ? "#141025" : "#f3f4f680"} !important;
          border: 1px solid ${isDarkMode ? "#2a2738" : "#d1d5db"} !important;
          transition: all 0.2s ease !important;
          box-shadow: none !important;
        }
        .premium-antd-select:hover .ant-select-selector {
          border-color: var(--secondary-color) !important;
        }
        .premium-antd-select.ant-select-focused .ant-select-selector {
          border-color: var(--secondary-color) !important;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--secondary-color) 10%, transparent) !important;
        }
        .dark-select .ant-select-selection-placeholder {
          color: #9ca0c1 !important;
        }
        .dark-select .ant-select-selection-item {
          color: var(--secondary-color) !important;
          background: color-mix(in srgb, var(--secondary-color) 15%, transparent) !important;
        }
        .dark-select .ant-select-selection-item:hover {
          background: color-mix(in srgb, var(--secondary-color) 25%, transparent) !important;
        }
        .ant-select-multiple .ant-select-selection-item {
          background: color-mix(in srgb, var(--secondary-color) 12%, transparent) !important;
          color: var(--secondary-color) !important;
          border: none !important;
          padding: 0 !important;
          border-radius: 4px !important;
        }
        .ant-select-multiple .ant-select-selection-item:hover {
          background: color-mix(in srgb, var(--secondary-color) 20%, transparent) !important;
        }
      `}</style>
    </div>
  );
};

export default MultiSelect;
