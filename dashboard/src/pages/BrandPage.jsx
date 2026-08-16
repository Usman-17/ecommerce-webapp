import { useState } from "react";
import toast from "react-hot-toast";
import { SquarePen, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import CustomInput from "../components/CustomInput";
import CustomUpload from "../components/CustomUpload";
import SuccessModal from "../components/SuccessModal";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import CustomDeleteModal from "../components/CustomDeleteModal";
import ModalActionButtons from "../components/ModalActionButtons";

import { useAutoFocus } from "../hooks/useAutoFocus";
import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllBrands } from "../hooks/useGetAllBrands";
// Imports End----

const BrandPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    imageFile: null,
    imagePreview: "",
  });
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

  const { brands = [], isLoading } = useGetAllBrands();

  const { mutate: saveBrand, isPending: isSaving } = useMutation({
    mutationFn: async (formDataToSend) => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/brand/update/${editItem._id}`
        : "/api/brand/create";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formDataToSend,
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save brand");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Brand ${editItem ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries(["brands"]);
      handleCloseModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteBrand, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/brand/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      setSuccessModalOpen(true);
      queryClient.invalidateQueries(["brands"]);
    },
    onError: () => {
      toast.error("Failed to delete brand");
      setConfirmModal({ open: false, name: "", id: null });
    },
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({ name: "", imageFile: null, imagePreview: "" });
    setAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditItem(record);
    setFormData({
      name: record.name,
      imageFile: null,
      imagePreview: record.image?.url || "",
    });
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setFormData({ name: "", imageFile: null, imagePreview: "" });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }
    saveBrand(formDataToSend);
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.name, id: record._id });
  };

  const handleConfirmDelete = () => {
    deleteBrand(confirmModal.id);
  };

  const handleCancelDelete = () => {
    setConfirmModal({ open: false, name: "", id: null });
  };

  const filteredData = useGlobalFilter(brands, globalSearch, ["sr", "name"]);

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
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 70,
      align: "center",
      render: (_, record) => {
        const img = record.image?.url;
        return img ? (
          <img
            src={img}
            alt={record.name}
            className="w-full h-10 rounded-lg object-contain mx-auto"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mx-auto text-xs text-gray-400">
            N/A
          </div>
        );
      },
    },
    {
      title: "Name",
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
        <SectionHeading title="Brands" subtitle="Manage brands below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
        >
          <SquarePen size={16} /> Add Brand
        </button>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search Brand..."
      />

      {/* Add / Edit Modal */}
      <CustomModal isOpen={addModal} className="w-[90%] max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editItem ? "Edit Brand" : "Add New Brand"}
            </h2>
            <p className="text-xs text-gray-500">
              {editItem
                ? "Update the brand details below"
                : "Enter the brand details below"}
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
          <CustomInput
            ref={firstInputRef}
            id="brandName"
            label="Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter Brand Name"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />

          <CustomUpload
            label=""
            title="Choose Image or Drag & Drop"
            description="Upload brand logo"
            value={formData.imagePreview}
            onChange={(file) =>
              setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
              }))
            }
          />
        </div>

        <ModalActionButtons
          onCancel={handleCloseModal}
          onSubmit={handleSave}
          isDisabled={!formData.name.trim()}
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
        message="Brand deleted successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  );
};

export default BrandPage;
