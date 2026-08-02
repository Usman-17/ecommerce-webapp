import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SquarePen,
  X,
  Plus,
  Upload,
  Star,
  Download,
  Camera,
  Sparkles,
} from "lucide-react";

import CustomTable from "../components/CustomTable";
import CustomInput from "../components/CustomInput";
import CustomSelect from "../components/CustomSelect";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import FullScreenModal from "../components/FullScreenModal";
import CustomDatePicker from "../components/CustomDatePicker";
import CustomDeleteModal from "../components/CustomDeleteModal";

import { useAutoFocus } from "../hooks/useAutoFocus";
import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { useGetAllProductReviews } from "../hooks/useGetAllProductReviews";
// Imports End----

const ProductReviewsPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    product: "",
    fullName: "",
    email: "",
    mobile: "",
    rating: 5,
    review: "",
    date: new Date().toISOString().split("T")[0],
    userImageFile: null,
    userImagePreview: "",
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    name: "",
    id: null,
  });
  const [bulkModal, setBulkModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");
  const firstInputRef = useAutoFocus(addModal);
  const fileInputRef = useRef(null);

  const { productReviews = [], isLoading } = useGetAllProductReviews();
  const { products = [] } = useGetAllProducts();

  const productOptions = products.map((p) => ({
    label: p.title,
    value: p._id,
  }));

  const { mutate: saveReview, isPending: isSaving } = useMutation({
    mutationFn: async (formDataToSend) => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/product-review/update/${editItem._id}`
        : "/api/product-review/create";

      const res = await fetch(url, { method, body: formDataToSend });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save review");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Review ${editItem ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries(["productReviews"]);
      handleCloseModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/product-review/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      queryClient.invalidateQueries(["productReviews"]);
      toast.success("Review deleted successfully");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: async (formDataToSend) => {
      const res = await fetch("/api/product-review/bulk-upload", {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to upload reviews");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["productReviews"]);
      setBulkModal(false);
      setExcelFile(null);
      setExcelFileName("");
      if (data.failed > 0) {
        toast.success(`${data.success} reviews created, ${data.failed} failed`);
      } else {
        toast.success(`${data.success} reviews created successfully`);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({
      product: "",
      fullName: "",
      email: "",
      mobile: "",
      rating: 5,
      review: "",
      date: new Date().toISOString().split("T")[0],
      userImageFile: null,
      userImagePreview: "",
    });
    setAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditItem(record);
    setFormData({
      product: record.productId || "",
      fullName: record.fullName,
      email: record.email || "",
      mobile: record.mobile || "",
      rating: record.rating,
      review: record.review,
      date: record.date
        ? new Date(record.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      userImageFile: null,
      userImagePreview: record.userImage?.url || "",
    });
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setFormData({
      product: "",
      fullName: "",
      email: "",
      mobile: "",
      rating: 5,
      review: "",
      date: new Date().toISOString().split("T")[0],
      userImageFile: null,
      userImagePreview: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        userImageFile: file,
        userImagePreview: url,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      userImageFile: null,
      userImagePreview: "",
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!formData.product) {
      toast.error("Product is required");
      return;
    }
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    if (!formData.review.trim()) {
      toast.error("Review is required");
      return;
    }

    const fd = new FormData();
    fd.append("productId", formData.product);
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("mobile", formData.mobile);
    fd.append("rating", String(formData.rating));
    fd.append("review", formData.review);
    fd.append("date", formData.date);

    if (formData.userImageFile) {
      fd.append("userImage", formData.userImageFile);
    }

    saveReview(fd);
  };

  const handleBulkUpload = () => {
    if (!excelFile) {
      toast.error("Please select an Excel file");
      return;
    }
    const fd = new FormData();
    fd.append("excelFile", excelFile);
    bulkUpload(fd);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Product Title",
      "Full Name",
      "Email",
      "Mobile",
      "Rating",
      "Review",
      "Date",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      "Sample Product,John Doe,john@example.com,03001234567,5,Great product!,2026-01-15";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "product-reviews-template.csv";
    link.click();
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.fullName, id: record._id });
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={`${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }`}
          >
            <Star
              size={16}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredData = useGlobalFilter(productReviews, globalSearch, [
    "sr",
    "fullName",
    "email",
    "mobile",
    "productTitle",
    "review",
  ]);

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "sr",
      key: "sr",
      width: 60,
      align: "center",
      sorter: (a, b) => a.sr - b.sr,
    },
    {
      title: "User",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.userImage?.url ? (
            <img
              src={record.userImage.url}
              alt={record.fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
              {record.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {record.fullName}
            </p>
            <p className="text-xs text-gray-400 truncate">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Product",
      dataIndex: "productTitle",
      key: "productTitle",
      width: 160,
      render: (_, record) => (
        <span className="text-sm text-gray-700 line-clamp-1 max-w-[200px] block">
          {record.productTitle}
        </span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      align: "center",
      sorter: (a, b) => a.rating - b.rating,
      render: (_, record) => renderStars(record.rating),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      width: 200,
      render: (_, record) => (
        <span className="text-sm text-gray-600 line-clamp-2 max-w-[200px] block">
          {record.review}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 110,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (_, record) => (
        <span className="text-sm text-gray-500">
          {record.date
            ? new Date(record.date).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <ActionButtons
          record={record}
          isEditLoading={isSaving && editItem?._id === record._id}
          isDeleteLoading={isDeleting}
          onEdit={(rec) => handleOpenEdit(rec)}
          onDelete={(rec) => handleDelete(rec)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeading
          title="Product Reviews"
          subtitle="Manage customer reviews for products"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBulkModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
          >
            <Upload size={16} /> Bulk Upload
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
          >
            <SquarePen size={16} /> Add Review
          </button>
        </div>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search reviews..."
      />

      {/* Add / Edit Modal */}
      <FullScreenModal
        open={addModal}
        onClose={handleCloseModal}
        title={editItem ? "Edit Review" : "Add New Review"}
        subtitle={
          editItem
            ? "Update the review details below"
            : "Enter the review details below"
        }
        showClose={false}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCloseModal}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                !formData.product ||
                !formData.fullName.trim() ||
                !formData.review.trim() ||
                isSaving
              }
              className="px-5 py-2 rounded-lg bg-(--secondary-color) text-white text-sm font-medium hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editItem ? "Update" : "Save"}
            </button>
          </div>
        }
      >
        <div className="flex gap-6">
          {/* Left Section - Form */}
          <div className="flex-1 space-y-4 p-5 rounded-lg border border-gray-200 bg-gray-50">
            <CustomSelect
              ref={firstInputRef}
              label="Product"
              required
              placeholder="Select Product"
              value={formData.product}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, product: val }))
              }
              options={productOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Full Name"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Enter user name"
              />
              <CustomInput
                label="Contact No"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="Enter contact number"
              />
            </div>

            <CustomInput
              label="Contact Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter contact email"
            />

            <CustomDatePicker
              label="Date"
              value={formData.date}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date ? date.format("YYYY-MM-DD") : "",
                }))
              }
            />

            <CustomInput
              label="Review"
              required
              type="textarea"
              rows={4}
              value={formData.review}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, review: e.target.value }))
              }
              placeholder="Write the review text..."
            />
          </div>

          {/* Right Section */}
          <div className="w-80 space-y-4">
            {/* User Image Card */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="text-md font-semibold mb-3">User Photo</h3>
              <div className="flex items-center gap-4">
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                  {formData.userImagePreview ? (
                    <img
                      src={formData.userImagePreview}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Camera size={24} className="text-gray-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                    <Camera size={20} className="text-white" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Upload reviewer photo</p>
                  <p className="text-[10px] text-gray-400">Max 5MB, JPG/PNG</p>
                  {formData.userImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-400 hover:text-red-500 mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 mb-5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <h3 className="text-md font-semibold">Your Rating</h3>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className="transition-colors cursor-pointer"
                  >
                    <Star
                      size={26}
                      className={
                        star <= formData.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500">
                Click on a star to rate
              </p>
            </div>

            {/* Review Tips Card */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles
                  size={16}
                  className="text-purple-500 fill-purple-500"
                />
                <h3 className="text-md font-semibold">Review Tips</h3>
              </div>
              <ul className="text-xs space-y-1.5 text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  Be specific about your experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  Mention product quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  Keep it honest and helpful
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  Avoid personal information
                </li>
              </ul>
            </div>
          </div>
        </div>
      </FullScreenModal>

      {/* Bulk Upload Modal */}
      <FullScreenModal
        open={bulkModal}
        onClose={() => {
          setBulkModal(false);
          setExcelFile(null);
          setExcelFileName("");
        }}
        title="Bulk Upload Reviews"
        subtitle="Upload an Excel file to add multiple reviews at once"
      >
        <div className="space-y-6 max-w-2xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Excel File Format
            </p>
            <p className="text-xs text-blue-600 mb-3">
              Your Excel file should have the following columns:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <span>1. Product Title (required)</span>
              <span>2. Full Name (required)</span>
              <span>3. Email</span>
              <span>4. Mobile</span>
              <span>5. Rating (1-5, required)</span>
              <span>6. Review (required)</span>
              <span>7. Date (YYYY-MM-DD)</span>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Download size={14} /> Download Template
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Excel File{" "}
              <span className="text-red-500 font-semibold">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                <div className="text-center">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  {excelFileName ? (
                    <p className="text-sm font-medium text-gray-700">
                      {excelFileName}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Click to select Excel file
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        .xlsx, .xls, or .csv
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setExcelFile(file);
                      setExcelFileName(file.name);
                    }
                  }}
                />
              </label>
              {excelFile && (
                <button
                  onClick={() => {
                    setExcelFile(null);
                    setExcelFileName("");
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setBulkModal(false);
                setExcelFile(null);
                setExcelFileName("");
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpload}
              disabled={!excelFile || isUploading}
              className="px-6 py-2.5 rounded-lg bg-(--secondary-color) text-white text-sm font-medium hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Reviews"}
            </button>
          </div>
        </div>
      </FullScreenModal>

      <CustomDeleteModal
        open={confirmModal.open}
        title={confirmModal.name}
        loading={isDeleting}
        onConfirm={() => deleteReview(confirmModal.id)}
        onCancel={() => setConfirmModal({ open: false, name: "", id: null })}
      />
    </>
  );
};

export default ProductReviewsPage;
