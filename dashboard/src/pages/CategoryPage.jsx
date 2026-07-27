import { useState } from "react";
import toast from "react-hot-toast";
import { SquarePen, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import CustomInput from "../components/CustomInput";
import CustomSelect from "../components/CustomSelect";
import SuccessModal from "../components/SuccessModal";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import CustomDeleteModal from "../components/CustomDeleteModal";
import ModalActionButtons from "../components/ModalActionButtons";

import { useAutoFocus } from "../hooks/useAutoFocus";
import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllAreas } from "../hooks/useGetAllAreas";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
// Imports End----

const CategoryPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ name: "", area: "" });
  const [globalSearch, setGlobalSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    name: "",
    id: null,
  });
  const firstInputRef = useAutoFocus(addModal);

  const { areas = [] } = useGetAllAreas();
  const { categories = [], isLoading } = useGetAllCategories();

  const { mutate: saveCategory, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/category/update/${editItem._id}`
        : "/api/category/create";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, area: formData.area }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save category");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(
        `Category ${editItem ? "updated" : "created"} successfully`,
      );
      queryClient.invalidateQueries(["categories"]);
      handleCloseModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      setSuccessModalOpen(true);
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      toast.error("Failed to delete category");
      setConfirmModal({ open: false, name: "", id: null });
    },
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({ name: "", area: "" });
    setAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditItem(record);
    setFormData({
      name: record.name,
      area: record.area?._id || "",
    });
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setFormData({ name: "", area: "" });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!formData.area) {
      toast.error("Please select an area");
      return;
    }
    saveCategory();
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.name, id: record._id });
  };

  const handleConfirmDelete = () => {
    deleteCategory(confirmModal.id);
  };

  const handleCancelDelete = () => {
    setConfirmModal({ open: false, name: "", id: null });
  };

  const filteredData = useGlobalFilter(categories, globalSearch, [
    "sr",
    "productCategoryName",
    "areaName",
  ]);

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "sr",
      key: "sr",
      width: 70,
      align: "center",
      sorter: (a, b) => a.sr - b.sr,
    },
    {
      title: "Area",
      dataIndex: "areaName",
      key: "areaName",
      sorter: (a, b) => a.areaName.localeCompare(b.areaName),
    },
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
        <SectionHeading title="Categories" subtitle="Manage Categories below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
        >
          <SquarePen size={16} /> Add Category
        </button>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search Category..."
      />

      {/* Add / Edit Modal */}
      <CustomModal isOpen={addModal} className="w-[90%] max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editItem ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-xs text-gray-500">
              {editItem
                ? "Update the category details below"
                : "Enter the category details below"}
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <CustomSelect
            ref={firstInputRef}
            label="Area"
            allowClear={false}
            required
            placeholder="Select Area"
            value={formData.area}
            onChange={(val) => setFormData((prev) => ({ ...prev, area: val }))}
            options={areas.map((a) => ({ label: a.name, value: a._id }))}
          />

          <CustomInput
            id="categoryName"
            label="Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter Category Name"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <ModalActionButtons
          onCancel={handleCloseModal}
          onSubmit={handleSave}
          isDisabled={!formData.name.trim() || !formData.area}
          isSubmitting={isSaving}
          submitText={editItem ? "Update" : "Add"}
        />
      </CustomModal>

      <CustomDeleteModal
        open={confirmModal.open}
        title={confirmModal.name}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal
        open={successModalOpen}
        message="Category deleted successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  );
};

export default CategoryPage;
