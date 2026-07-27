import { useState } from "react";
import toast from "react-hot-toast";
import { SquarePen, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import CustomInput from "../components/CustomInput";
import SuccessModal from "../components/SuccessModal";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import CustomDeleteModal from "../components/CustomDeleteModal";
import ModalActionButtons from "../components/ModalActionButtons";

import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllAreas } from "../hooks/useGetAllAreas";
// Imports End----

const AreaPage = () => {
  const queryClient = useQueryClient();

  const [globalSearch, setGlobalSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    name: "",
    id: null,
  });

  const { areas = [], isLoading } = useGetAllAreas();

  const { mutate: saveArea, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/area/update/${editItem._id}`
        : "/api/area/create";

      const formData = new FormData();
      formData.append("name", areaName);

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save area");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Area ${editItem ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries(["areas"]);
      handleCloseModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteArea, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/area/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete area");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      setSuccessModalOpen(true);
      queryClient.invalidateQueries(["areas"]);
    },
    onError: () => {
      toast.error("Failed to delete area");
      setConfirmModal({ open: false, name: "", id: null });
    },
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setAreaName("");
    setAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditItem(record);
    setAreaName(record.name);
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setAreaName("");
  };

  const handleSave = () => {
    if (!areaName.trim()) {
      toast.error("Area name is required");
      return;
    }
    saveArea();
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.name, id: record._id });
  };

  const handleConfirmDelete = () => {
    deleteArea(confirmModal.id);
  };

  const handleCancelDelete = () => {
    setConfirmModal({ open: false, name: "", id: null });
  };

  const filteredData = useGlobalFilter(areas, globalSearch, [
    "sr",
    "productAreaName",
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
        <SectionHeading title="Areas" subtitle="Manage Areas below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
        >
          <SquarePen size={16} /> Add Area
        </button>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search Area..."
      />

      {/* Add / Edit Modal */}
      <CustomModal isOpen={addModal} className="w-[90%] max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editItem ? "Edit Area" : "Add New Area"}
            </h2>
            <p className="text-xs text-gray-500">
              {editItem
                ? "Update the area name below"
                : "Enter the area name below"}
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <CustomInput
          id="areaName"
          label="Name"
          required
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="Enter Area Name"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />

        <ModalActionButtons
          onCancel={handleCloseModal}
          onSubmit={handleSave}
          isDisabled={!areaName.trim()}
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
        message="Area deleted successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  );
};

export default AreaPage;
