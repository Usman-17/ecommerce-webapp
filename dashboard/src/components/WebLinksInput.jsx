import { useState } from "react";
import { X, GripVertical, Link, ListChecks } from "lucide-react";
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
import { Select } from "antd";

const predefinedWebLinks = [
  { label: "All Products", value: "All Products" },
  { label: "Best Sellers", value: "Best Sellers" },
  { label: "New Arrivals", value: "New Arrivals" },
  { label: "Scoop", value: "Scoop" },
];

const SortableTag = ({ tag, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium select-none"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-blue-400 hover:text-blue-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      {tag}
      <button
        type="button"
        onClick={() => onRemove(tag)}
        className="ml-0.5 text-blue-400 hover:text-blue-700"
      >
        <X size={14} />
      </button>
    </span>
  );
};

const WebLinksInput = ({
  value = [],
  onChange,
  options = predefinedWebLinks,
  label,
  required,
}) => {
  const [inputValue, setInputValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
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
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const handleSelect = (selectedValue) => {
    if (selectedValue && !value.includes(selectedValue)) {
      onChange([...value, selectedValue]);
    }
    setInputValue("");
  };

  const handleRemove = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    }
  };

  const handleSelectAll = () => {
    const allValues = options
      .filter((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        return !value.includes(val);
      })
      .map((opt) => (typeof opt === "string" ? opt : opt.value));
    if (allValues.length > 0) {
      onChange([...value, ...allValues]);
    }
    setInputValue("");
  };

  const availableOptions = options
    .filter((opt) => {
      const tagValue = typeof opt === "string" ? opt : opt.value;
      return !value.includes(tagValue);
    })
    .map((opt) => {
      if (typeof opt === "string") return { label: opt, value: opt };
      return opt;
    });

  const hasUnselected = options.some((opt) => {
    const val = typeof opt === "string" ? opt : opt.value;
    return !value.includes(val);
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium mb-1 text-gray-700 flex items-center gap-1.5">
          <Link size={14} className="text-blue-500" />
          {label}{" "}
          {required ? (
            <span className="text-red-500 font-semibold">*</span>
          ) : (
            <span className="text-xs font-normal text-gray-400">
              (Optional)
            </span>
          )}
        </label>
      )}

      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {value.map((tag) => (
                <SortableTag key={tag} tag={tag} onRemove={handleRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Select
        showSearch
        allowClear
        placeholder="Select pages to show product on"
        searchValue={inputValue}
        onSearch={setInputValue}
        onSelect={(val) => {
          if (val === "__select_all__") {
            handleSelectAll();
          } else {
            handleSelect(val);
          }
        }}
        onKeyDown={handleKeyDown}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={
          hasUnselected
            ? [
                {
                  label: "Select All",
                  value: "__select_all__",
                  className: "!font-bold !text-blue-600",
                },
                ...availableOptions,
              ]
            : availableOptions
        }
        optionRender={(option) => {
          if (option.value === "__select_all__") {
            return (
              <div className="flex items-center gap-2 font-bold text-blue-600">
                <ListChecks size={14} />
                <span>Select All</span>
              </div>
            );
          }
          return <span>{option.label}</span>;
        }}
        className="w-full my-custom-select"
        popupClassName="!z-[9999999]"
        dropdownStyle={{ zIndex: 9999 }}
        styles={{ popup: { root: { borderRadius: "12px" } } }}
        suffixIcon={null}
      />
    </div>
  );
};

export default WebLinksInput;
