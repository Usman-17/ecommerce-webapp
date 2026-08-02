import { useState } from "react";
import {
  X,
  GripVertical,
  BadgeCheck,
  Star,
  TrendingUp,
  Sparkles,
  Gem,
  Crown,
  Tag,
} from "lucide-react";
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

const iconMap = {
  "Best Seller": BadgeCheck,
  "Top Rated": Star,
  Trending: TrendingUp,
  New: Sparkles,
  Special: Gem,
  Popular: Crown,
  Sale: Tag,
};

const predefinedTags = [
  { label: "Best Seller", icon: BadgeCheck },
  { label: "Top Rated", icon: Star },
  { label: "Trending", icon: TrendingUp },
  { label: "New", icon: Sparkles },
  { label: "Special", icon: Gem },
  { label: "Popular", icon: Crown },
  { label: "Sale", icon: Tag },
];

const SortableTag = ({ tag, onRemove }) => {
  const Icon = iconMap[tag];
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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium select-none"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-purple-400 hover:text-purple-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      {Icon && <Icon size={13} />}
      {tag}
      <button
        type="button"
        onClick={() => onRemove(tag)}
        className="ml-0.5 text-purple-400 hover:text-purple-700"
      >
        <X size={14} />
      </button>
    </span>
  );
};

const TagsInput = ({
  value = [],
  onChange,
  options = predefinedTags,
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

  const availableOptions = options
    .filter((opt) => {
      const tagValue = typeof opt === "string" ? opt : opt.value;
      return !value.includes(tagValue);
    })
    .map((opt) => {
      if (typeof opt === "string") return { label: opt, value: opt };
      return opt;
    });

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700">
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
        placeholder="Enter or Select Tags"
        searchValue={inputValue}
        onSearch={setInputValue}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={availableOptions}
        optionRender={(option) => {
          const Icon = iconMap[option.value];
          return (
            <div className="flex items-center gap-2">
              {Icon && <Icon size={14} className="text-gray-500" />}
              <span>{option.label}</span>
            </div>
          );
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

export default TagsInput;
