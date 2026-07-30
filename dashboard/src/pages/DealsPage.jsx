import { useState } from "react";
import toast from "react-hot-toast";
import { SquarePen, X, Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Input } from "antd";

import CustomTable from "../components/CustomTable";
import FullScreenModal from "../components/FullScreenModal";
import CustomInput from "../components/CustomInput";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import CustomDeleteModal from "../components/CustomDeleteModal";
import ModalActionButtons from "../components/ModalActionButtons";

import { useAutoFocus } from "../hooks/useAutoFocus";
import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllDeals } from "../hooks/useGetAllDeals";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
// Imports End----

const DealsPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dealPrice: "",
    originalPrice: "",
    productIds: [],
    imageFiles: [],
    imagePreviews: [],
    removedImages: [],
    isActive: true,
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    name: "",
    id: null,
  });
  const [productSearch, setProductSearch] = useState("");
  const firstInputRef = useAutoFocus(addModal);

  const { deals = [], isLoading } = useGetAllDeals();
  const { products = [] } = useGetAllProducts();

  const { mutate: saveDeal, isPending: isSaving } = useMutation({
    mutationFn: async (formDataToSend) => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/deal/update/${editItem._id}`
        : "/api/deal/create";

      const res = await fetch(url, { method, body: formDataToSend });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save deal");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Deal ${editItem ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries(["deals"]);
      handleCloseModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteDeal, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/deal/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete deal");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      queryClient.invalidateQueries(["deals"]);
      toast.success("Deal deleted successfully");
    },
    onError: () => toast.error("Failed to delete deal"),
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({
      title: "",
      description: "",
      dealPrice: "",
      originalPrice: "",
      productIds: [],
      imageFiles: [],
      imagePreviews: [],
      removedImages: [],
      isActive: true,
    });
    setProductSearch("");
    setAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditItem(record);
    setFormData({
      title: record.title,
      description: record.description || "",
      dealPrice: record.dealPrice,
      originalPrice: record.originalPrice || "",
      productIds: record.productIds || [],
      imageFiles: [],
      imagePreviews: record.images?.map((img) => img.url) || [],
      removedImages: [],
      isActive: record.isActive,
    });
    setProductSearch("");
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setFormData({
      title: "",
      description: "",
      dealPrice: "",
      originalPrice: "",
      productIds: [],
      imageFiles: [],
      imagePreviews: [],
      removedImages: [],
      isActive: true,
    });
  };

  const handleAddImage = (file) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, file],
      imagePreviews: [...prev.imagePreviews, url],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newPreviews = [...prev.imagePreviews];
      const newFiles = [...prev.imageFiles];
      const newRemoved = [...prev.removedImages];

      if (editItem && index < (editItem.images?.length || 0)) {
        newRemoved.push(editItem.images[index].public_id);
      }

      newPreviews.splice(index, 1);
      const existingCount = editItem?.images?.length || 0;
      if (index >= existingCount) {
        newFiles.splice(index - existingCount, 1);
      }

      return {
        ...prev,
        imagePreviews: newPreviews,
        imageFiles: newFiles,
        removedImages: newRemoved,
      };
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Deal title is required");
      return;
    }
    if (!formData.dealPrice || formData.dealPrice <= 0) {
      toast.error("Valid deal price is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("dealPrice", formData.dealPrice);
    if (formData.originalPrice) {
      formDataToSend.append("originalPrice", formData.originalPrice);
    }
    formDataToSend.append("products", JSON.stringify(formData.productIds));
    formDataToSend.append("isActive", String(formData.isActive));

    if (editItem && formData.removedImages.length > 0) {
      formDataToSend.append(
        "removedImages",
        JSON.stringify(formData.removedImages),
      );
    }

    for (const file of formData.imageFiles) {
      formDataToSend.append("images", file);
    }

    saveDeal(formDataToSend);
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.title, id: record._id });
  };

  const handleConfirmDelete = () => {
    deleteDeal(confirmModal.id);
  };

  const filteredData = useGlobalFilter(deals, globalSearch, [
    "sr",
    "title",
    "dealPriceStr",
  ]);

  // Product table columns
  const productColumns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.productImage}
            alt={record.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">
              {record.title}
            </p>
            <p className="text-xs text-gray-400">
              Rs. {record.price?.toLocaleString()}
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Row selection config
  const rowSelection = {
    selectedRowKeys: formData.productIds,
    onChange: (selectedRowKeys) => {
      setFormData((prev) => ({ ...prev, productIds: selectedRowKeys }));
    },
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sr?.toString().includes(productSearch),
  );

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
      title: "Images",
      dataIndex: "images",
      key: "images",
      width: 80,
      align: "center",
      render: (_, record) => {
        const img = record.images?.[0]?.url;
        return img ? (
          <div className="relative">
            <img
              src={img}
              alt={record.title}
              className="w-12 h-12 rounded-lg object-cover mx-auto"
            />
            {record.imagesCount > 1 && (
              <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {record.imagesCount}
              </span>
            )}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto text-xs text-gray-400">
            N/A
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Products",
      dataIndex: "productsCount",
      key: "productsCount",
      width: 90,
      align: "center",
      sorter: (a, b) => a.productsCount - b.productsCount,
      render: (_, record) => (
        <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {record.productsCount} item(s)
        </span>
      ),
    },
    {
      title: "Deal Price",
      dataIndex: "dealPriceStr",
      key: "dealPriceStr",
      width: 110,
      sorter: (a, b) => a.dealPrice - b.dealPrice,
      render: (_, record) => (
        <span className="font-semibold text-accent">{record.dealPriceStr}</span>
      ),
    },
    {
      title: "Original",
      dataIndex: "originalPriceStr",
      key: "originalPriceStr",
      width: 100,
      render: (_, record) => (
        <span className="text-gray-400 line-through text-sm">
          {record.originalPriceStr}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      align: "center",
      render: (_, record) => (
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
            record.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {record.isActive ? "Active" : "Inactive"}
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
        <SectionHeading title="Deals" subtitle="Manage deals & offers below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
        >
          <SquarePen size={16} /> Add Deal
        </button>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search deals..."
      />

      {/* Add / Edit FullScreen Modal */}
      <FullScreenModal
        open={addModal}
        onClose={handleCloseModal}
        title={editItem ? "Edit Deal" : "Add New Deal"}
        subtitle={
          editItem
            ? "Update the deal details below"
            : "Enter the deal details below"
        }
      >
        <div className="space-y-6 max-w-4xl">
          {/* Title */}
          <CustomInput
            ref={firstInputRef}
            id="dealTitle"
            label="Deal Title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. Summer Bundle Offer"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional description..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color)"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              id="dealPrice"
              label="Deal Price"
              required
              type="number"
              value={formData.dealPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dealPrice: e.target.value,
                }))
              }
              placeholder="e.g. 2500"
            />
            <CustomInput
              id="originalPrice"
              label="Original Price"
              type="number"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  originalPrice: e.target.value,
                }))
              }
              placeholder="e.g. 4000"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Images
            </label>
            <div className="flex flex-wrap gap-3">
              {formData.imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Deal image ${index + 1}`}
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {formData.imagePreviews.length < 5 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-(--secondary-color) hover:text-(--secondary-color) transition-colors cursor-pointer">
                  <Plus size={20} />
                  <span className="text-[9px] font-medium mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => handleAddImage(file));
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Upload up to 5 images. First image will be the cover.
            </p>
          </div>

          {/* Product Selector - antd Table with rowSelection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Products ({formData.productIds.length} selected)
            </label>
            <Input.Search
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="mb-2"
              allowClear
            />
            <Table
              rowKey="_id"
              columns={productColumns}
              dataSource={filteredProducts}
              rowSelection={rowSelection}
              size="small"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ y: 300 }}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title.trim() || !formData.dealPrice || isSaving}
              className="px-6 py-2.5 rounded-lg bg-(--secondary-color) text-white text-sm font-medium hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editItem ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </FullScreenModal>

      <CustomDeleteModal
        open={confirmModal.open}
        title={confirmModal.name}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ open: false, name: "", id: null })}
      />
    </>
  );
};

export default DealsPage;
