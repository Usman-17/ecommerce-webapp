import { Inbox } from "lucide-react";
import { Upload } from "antd";
import { useState, useEffect } from "react";

const CustomUpload = ({
  value,
  onChange,
  previewHeight = 160,
  multiple = false,
  darkMode = false,
  label = "Image",
  title = "Choose File or Drag & Drop",
  description = "Upload a single image",
}) => {
  const [previewImage, setPreviewImage] = useState(value || null);

  useEffect(() => {
    setPreviewImage(value || null);
  }, [value]);

  const handleBeforeUpload = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    onChange?.(file);
    return false;
  };

  return (
    <>
      <label
        className={`block text-sm font-medium mb-1 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <Upload.Dragger
        name="file"
        multiple={multiple}
        accept="image/*"
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
        className={`rounded-xl ${
          darkMode ? "border-white/10" : "border-gray-300"
        }`}
      >
        {previewImage ? (
          <div
            className="relative group rounded-xl overflow-hidden flex items-center justify-center"
            style={{ height: previewHeight }}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Change Image</p>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{ height: previewHeight }}
          >
            <Inbox size={40} className="mb-2 text-[var(--secondary-color)]" />

            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-800"
              }`}
              style={{ fontFamily: "Outfit" }}
            >
              {title}
            </p>

            <p
              className={`text-xs ${
                darkMode ? "text-gray-500" : "text-gray-600"
              }`}
              style={{ fontFamily: "Outfit" }}
            >
              {description}
            </p>
          </div>
        )}
      </Upload.Dragger>
    </>
  );
};

export default CustomUpload;
