import toast from "react-hot-toast";
import { useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { SquarePen, Plus, Upload, X, GripVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TagsInput from "../components/TagsInput";
import WebLinksInput from "../components/WebLinksInput";
import CustomTable from "../components/CustomTable";
import CustomInput from "../components/CustomInput";
import TipTapEditor from "../components/TipTapEditor";
import CustomSelect from "../components/CustomSelect";
import SuccessModal from "../components/SuccessModal";
import ActionButtons from "../components/ActionButtons";
import SectionHeading from "../components/SectionHeading";
import FullScreenModal from "../components/FullScreenModal";
import CustomDeleteModal from "../components/CustomDeleteModal";
import ModalActionButtons from "../components/ModalActionButtons";

import { useAutoFocus } from "../hooks/useAutoFocus";
import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllAreas } from "../hooks/useGetAllAreas";
import { useGetAllBrands } from "../hooks/useGetAllBrands";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
import { useGetSubCategoriesByCategory } from "../hooks/useGetSubCategoriesByCategory";
// Imports End-----

const tabs = [
  "Basic Info",
  "Variants",
  "Bulk Pricing",
  "Tags & Links",
  "Description",
  "Images",
];

const variantTypes = ["Color", "Shade", "Size", "Material", "Weight", "Other"];

const emptyVariant = () => ({
  name: "",
  type: "Other",
  hexColor: "",
  price: "",
  isActive: true,
  images: [],
  imagePreviews: [],
  existingImages: [],
});

const SortableImage = ({ img, index, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <img
        src={img}
        alt=""
        className="w-24 h-24 object-cover rounded shadow-sm"
      />
      <button
        type="button"
        className="absolute top-0.5 left-0.5 bg-white/80 text-gray-600 rounded p-0.5 cursor-grab active:cursor-grabbing hover:bg-white"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer"
      >
        ✕
      </button>
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
        {index + 1}
      </span>
    </div>
  );
};

const ProductPage = () => {
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeTab, setActiveTab] = useState("Basic Info");
  const [isSavingAndClose, setIsSavingAndClose] = useState(false);
  const isSavingAndCloseRef = useRef(false);

  const [globalSearch, setGlobalSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    name: "",
    id: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    area: "",
    category: "",
    subCategory: "",
    brand: "",
    sold: "",
    tags: [],
    webLinks: [],
    isActive: true,
    price: "",
    purchasePrice: "",
    secondaryPrice: "",
    productImages: [],
    existingImages: [],
  });

  const [productImages, setProductImages] = useState([]);
  const [productImgPreview, setProductImgPreview] = useState([]);
  const [variants, setVariants] = useState([emptyVariant()]);
  const [bulkPricing, setBulkPricing] = useState([]);

  const { products = [], isLoading } = useGetAllProducts();
  const { brands = [] } = useGetAllBrands();
  const { areas = [] } = useGetAllAreas();
  const { categories = [] } = useGetAllCategories();
  const { subCategories = [] } = useGetSubCategoriesByCategory(
    formData.category,
  );

  const firstInputRef = useAutoFocus(addModal);

  const location = useLocation();

  useEffect(() => {
    setAddModal(false);
    setEditItem(null);
  }, [location.pathname]);

  const filteredCategories = formData.area
    ? categories.filter((cat) => cat.areaId === formData.area)
    : categories;

  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: async (formDataToSend) => {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/product/update/${editItem._id}`
        : "/api/product/create";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: "include",
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      if (isSavingAndCloseRef.current) {
        handleCloseModal();
      } else {
        handleOpenAdd();
      }
      isSavingAndCloseRef.current = false;
      setIsSavingAndClose(false);
      setTimeout(() => {
        toast.success(
          `Product ${editItem ? "updated" : "created"} successfully`,
        );
      }, 100);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      setConfirmModal({ open: false, name: "", id: null });
      setSuccessModalOpen(true);
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      toast.error("Failed to delete product");
      setConfirmModal({ open: false, name: "", id: null });
    },
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({
      title: "",
      description: "",
      area: "",
      category: "",
      subCategory: "",
      brand: "",
      sold: "",
      tags: [],
      webLinks: [],
      isActive: true,
      price: "",
      purchasePrice: "",
      secondaryPrice: "",
      productImages: [],
      existingImages: [],
    });
    setProductImages([]);
    setProductImgPreview([]);
    setVariants([emptyVariant()]);
    setBulkPricing([]);
    setActiveTab("Basic Info");
    setAddModal(true);
  };

  const handleOpenEdit = async (record) => {
    try {
      const res = await fetch(`/api/product/admin/${record._id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to load product");
        return;
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        area: data.areaId || "",
        category: data.categoryId || "",
        subCategory: data.subCategoryId || "",
        brand: data.brandId || "",
        tags: data.tags || [],
        webLinks: data.webLinks || [],
        isActive: data.isActive ?? true,
        price: data.price || "",
        purchasePrice: data.purchasePrice || "",
        secondaryPrice: data.secondaryPrice || "",
        sold: data.sold || "",
        productImages: data.productImages || [],
        existingImages: data.productImages || [],
      });

      setProductImgPreview(
        data.productImages?.filter(Boolean).map((img) => img.url) || [],
      );
      setProductImages([]);

      if (data.variants && data.variants.length > 0) {
        setVariants(
          data.variants.map((v) => {
            const variantImages = (
              v.images || (v.image ? [v.image] : [])
            ).filter(Boolean);
            return {
              _id: v._id,
              name: v.name || "",
              type: v.type || "Other",
              hexColor: v.hexColor || "",
              price: v.price ?? "",
              isActive: v.isActive !== false,
              images: [],
              imagePreviews: variantImages
                .filter(Boolean)
                .map((img) => img.url),
              existingImages: variantImages,
            };
          }),
        );
      } else {
        setVariants([emptyVariant()]);
      }

      setBulkPricing(
        (data.bulkPricing || []).map((bp) => ({
          ...bp,
          perItem:
            bp.quantity && bp.price
              ? String(Math.round(bp.price / bp.quantity))
              : "",
        })),
      );
      setEditItem(record);
      setActiveTab("Basic Info");
      setAddModal(true);
    } catch (err) {
      toast.error(err.message || "Failed to load product");
    }
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setEditItem(null);
    setFormData({
      title: "",
      description: "",
      area: "",
      category: "",
      subCategory: "",
      brand: "",
      sold: "",
      tags: [],
      webLinks: [],
      isActive: true,
      price: "",
      purchasePrice: "",
      secondaryPrice: "",
      productImages: [],
      existingImages: [],
    });
    setProductImages([]);
    setProductImgPreview([]);
    setVariants([emptyVariant()]);
    setBulkPricing([]);
    setActiveTab("Basic Info");
  };

  const handleSave = (saveAndClose = true) => {
    isSavingAndCloseRef.current = saveAndClose;
    setIsSavingAndClose(saveAndClose);

    const missingFields = [];
    if (!formData.title.trim()) missingFields.push("Title");
    if (!formData.price) missingFields.push("Price");

    if (missingFields.length > 0) {
      toast.error(
        `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required`,
      );
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages" || key === "existingImages") return;
      if (Array.isArray(value)) {
        value.forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, value);
      }
    });

    productImages.forEach((file) => {
      formDataToSend.append("productImages", file);
    });

    if (formData.productImages.length > 0) {
      formDataToSend.append(
        "existingProductImages",
        JSON.stringify(formData.productImages),
      );
    }

    const variantsForApi = variants.map((v) => {
      const cleaned = {
        name: v.name,
        type: v.type || "Other",
        hexColor: v.type === "Color" ? v.hexColor || undefined : undefined,
        price: v.price !== "" ? Number(v.price) : undefined,
        isActive: v.isActive !== false,
      };
      if (v._id) cleaned._id = v._id;
      if (v.existingImages.length > 0) {
        cleaned.images = v.existingImages;
      }
      return cleaned;
    });

    formDataToSend.append("variants", JSON.stringify(variantsForApi));

    const filteredBulkPricing = bulkPricing
      .filter((bp) => bp.quantity && (bp.price || bp.perItem))
      .map((bp) => ({
        quantity: Number(bp.quantity),
        price: bp.perItem
          ? Number(bp.perItem) * Number(bp.quantity)
          : Number(bp.price),
      }));
    formDataToSend.append("bulkPricing", JSON.stringify(filteredBulkPricing));

    variants.forEach((v, i) => {
      v.images.forEach((file) => {
        formDataToSend.append(`variant_${i}_image`, file);
      });
    });

    saveProduct(formDataToSend);
  };

  const handleDelete = (record) => {
    setConfirmModal({ open: true, name: record.title, id: record._id });
  };

  const handleConfirmDelete = () => {
    deleteProduct(confirmModal.id);
  };

  const handleCancelDelete = () => {
    setConfirmModal({ open: false, name: "", id: null });
  };

  const handleSelectChange = (value, key) => {
    if (key === "area") {
      setFormData((prev) => ({
        ...prev,
        area: value,
        category: "",
        subCategory: "",
      }));
    } else if (key === "category") {
      setFormData((prev) => ({ ...prev, category: value, subCategory: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleProductImgChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProductImgPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setProductImgPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
    setProductImgPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderImages = (oldIndex, newIndex) => {
    setProductImgPreview((prev) => arrayMove(prev, oldIndex, newIndex));
    setProductImages((prev) => arrayMove(prev, oldIndex, newIndex));
    setFormData((prev) => ({
      ...prev,
      productImages: arrayMove(prev.productImages, oldIndex, newIndex),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              images: [...v.images, ...files],
              imagePreviews: [
                ...v.imagePreviews,
                ...files.map((f) => URL.createObjectURL(f)),
              ],
            }
          : v,
      ),
    );
  };

  const handleRemoveVariantImage = (variantIndex, imgIndex) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        return {
          ...v,
          images: v.images.filter((_, j) => j !== imgIndex),
          imagePreviews: v.imagePreviews.filter((_, j) => j !== imgIndex),
          existingImages: v.existingImages.filter((_, j) => j !== imgIndex),
        };
      }),
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const filteredData = useGlobalFilter(products, globalSearch, [
    "sr",
    "title",
    "areaName",
    "categoryName",
    "subCategoryName",
  ]);

  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      width: 60,
      align: "center",
      sorter: (a, b) => a.sr - b.sr,
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      width: 70,
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="Product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            N/A
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text) => (
        <span className="block max-w-[250px] truncate" title={text}>
          {text}
        </span>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Area",
      dataIndex: "areaName",
      key: "areaName",
      sorter: (a, b) => (a.areaName || "").localeCompare(b.areaName || ""),
    },
    {
      title: "Category",
      key: "categorySubCategory",
      render: (_, record) => (
        <div>
          <div>{record.categoryName || "-"}</div>
          <div className="text-xs text-gray-400">
            {record.subCategoryName || "-"}
          </div>
        </div>
      ),
      sorter: (a, b) =>
        (a.categoryName || "").localeCompare(b.categoryName || ""),
    },
    {
      title: "Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 120,
      align: "center",
      render: (val) => val || 0,
      sorter: (a, b) => (a.purchasePrice || 0) - (b.purchasePrice || 0),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "center",
      sorter: (a, b) => a.price - b.price,
    },

    {
      title: "S Price",
      dataIndex: "secondaryPrice",
      key: "secondaryPrice",
      width: 130,
      align: "center",
      render: (val, record) =>
        val ? (
          <span className={record.price ? "line-through text-gray-400" : ""}>
            {val}
          </span>
        ) : (
          "-"
        ),
      sorter: (a, b) => (a.secondaryPrice || 0) - (b.secondaryPrice || 0),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      align: "center",
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
      render: (isActive) => (
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
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

  const tabBtnClass = (tab) =>
    `px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-500 hover:text-black"
    }`;

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-4">
        <SectionHeading title="Products" subtitle="Manage Products below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium shrink-0"
        >
          <SquarePen size={16} /> Add Product
        </button>
      </div>

      <CustomTable
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search Product..."
      />

      {/* Add / Edit Modal */}
      <FullScreenModal
        open={addModal}
        onClose={handleCloseModal}
        title={editItem ? "Edit Product" : "Add New Product"}
        subtitle={
          editItem
            ? "Update the product details below"
            : "Enter the product details below"
        }
      >
        <div className="flex flex-col flex-1">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={tabBtnClass(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-[300px]">
            {activeTab === "Basic Info" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <CustomInput
                      ref={firstInputRef}
                      id="productTitle"
                      label="Title"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter Product Title"
                    />
                  </div>
                  <div className="sm:col-span-3 flex flex-col justify-end">
                    <CustomSelect
                      label="Brand"
                      placeholder="Select Brand"
                      value={formData.brand}
                      onChange={(val) => handleSelectChange(val, "brand")}
                      options={brands.map((b) => ({
                        label: b.name,
                        value: b._id,
                      }))}
                    />
                  </div>
                  <div className="sm:col-span-1 flex flex-col justify-end items-start sm:items-center">
                    <label className="text-[11px] font-medium text-gray-500 mb-1 hidden sm:block">
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: !prev.isActive,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        formData.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CustomSelect
                    label="Area"
                    placeholder="Select Area"
                    value={formData.area}
                    onChange={(val) => handleSelectChange(val, "area")}
                    options={areas.map((a) => ({
                      label: a.name,
                      value: a._id,
                    }))}
                  />

                  <CustomSelect
                    label="Category"
                    placeholder="Select Category"
                    value={formData.category}
                    onChange={(val) => handleSelectChange(val, "category")}
                    options={filteredCategories.map((c) => ({
                      label: c.name,
                      value: c._id,
                    }))}
                  />

                  <CustomSelect
                    label="SubCategory"
                    placeholder="Select SubCategory"
                    value={formData.subCategory}
                    onChange={(val) => handleSelectChange(val, "subCategory")}
                    options={subCategories.map((sc) => ({
                      label: sc.name,
                      value: sc._id,
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <CustomInput
                    id="purchasePrice"
                    label="Purchase Price"
                    type="number"
                    value={formData.purchasePrice}
                    placeholder="Enter Purchase Price"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        purchasePrice: e.target.value,
                      }))
                    }
                  />

                  <CustomInput
                    id="productPrice"
                    label="Price"
                    required
                    type="number"
                    placeholder="Enter Product Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />

                  <CustomInput
                    id="secondaryPrice"
                    label="Secondary Price"
                    type="number"
                    placeholder="Enter Secondary Price"
                    value={formData.secondaryPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secondaryPrice: e.target.value,
                      }))
                    }
                  />

                  <CustomInput
                    id="sold"
                    label="Sold"
                    placeholder="Enter number sold"
                    value={formData.sold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sold: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* Tags & Links Tab */}
            {activeTab === "Tags & Links" && (
              <div className="space-y-4">
                <TagsInput
                  label="Tags"
                  value={formData.tags}
                  onChange={(val) => handleSelectChange(val, "tags")}
                />

                <WebLinksInput
                  label="Web Links"
                  value={formData.webLinks || []}
                  onChange={(val) => handleSelectChange(val, "webLinks")}
                />
              </div>
            )}

            {/* Description Tab */}
            {activeTab === "Description" && (
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Product Description{" "}
                  <span className="text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>
                <TipTapEditor
                  value={formData.description}
                  onChange={(newContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: newContent,
                    }))
                  }
                />
              </div>
            )}

            {/* Variants Tab */}
            {activeTab === "Variants" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Variants</label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add Variant
                  </button>
                </div>

                {variants.map((variant, vi) => (
                  <div
                    key={vi}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-500 shrink-0">
                        {vi + 1}.
                      </span>

                      <select
                        value={variant.type}
                        onChange={(e) =>
                          handleVariantChange(vi, "type", e.target.value)
                        }
                        className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-24"
                      >
                        {variantTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        required
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(vi, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 w-32"
                      />

                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(vi, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 w-20"
                      />

                      {variant.type === "Color" && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={variant.hexColor || "#000000"}
                            onChange={(e) =>
                              handleVariantChange(
                                vi,
                                "hexColor",
                                e.target.value,
                              )
                            }
                            className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0"
                          />
                          <input
                            type="text"
                            value={variant.hexColor || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                vi,
                                "hexColor",
                                e.target.value,
                              )
                            }
                            placeholder="#000000"
                            className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                        </div>
                      )}

                      <label className="flex items-center gap-1.5 text-xs bg-black text-white px-2.5 py-2 rounded hover:bg-neutral-800 cursor-pointer shrink-0">
                        <Upload size={12} /> Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleVariantImageChange(vi, e)}
                        />
                      </label>

                      {variant.imagePreviews.length > 0 && (
                        <div className="flex gap-1">
                          {variant.imagePreviews.map((img, ii) => (
                            <div key={ii} className="relative group">
                              <img
                                src={img}
                                alt=""
                                className="w-12 h-12 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(vi, ii)}
                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] hover:bg-red-700 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 ml-auto shrink-0">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <span className="text-[10px] text-gray-400">
                            Active
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleVariantChange(
                                vi,
                                "isActive",
                                !variant.isActive,
                              )
                            }
                            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                              variant.isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                                variant.isActive
                                  ? "translate-x-3.5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </label>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(vi)}
                            className="text-red-500 hover:text-red-400 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bulk Pricing Tab */}
            {activeTab === "Bulk Pricing" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold">
                      Bulk Pricing
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Offer special prices for buying multiple items
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setBulkPricing([
                        ...bulkPricing,
                        { quantity: "", price: "" },
                      ])
                    }
                    className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add Tier
                  </button>
                </div>

                {bulkPricing.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No bulk pricing tiers added yet
                  </p>
                )}

                {bulkPricing.map((tier, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <label className="text-[11px] text-gray-500 mb-1 block">
                        Buy Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.quantity}
                        onChange={(e) => {
                          const updated = [...bulkPricing];
                          updated[i].quantity = e.target.value;
                          setBulkPricing(updated);
                        }}
                        placeholder="e.g. 3"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[11px] text-gray-500 mb-1 block">
                        Price (per item)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={tier.perItem || ""}
                        onChange={(e) => {
                          const updated = [...bulkPricing];
                          updated[i].perItem = e.target.value;
                          if (e.target.value && updated[i].quantity) {
                            updated[i].price =
                              Number(e.target.value) *
                              Number(updated[i].quantity);
                          }
                          setBulkPricing(updated);
                        }}
                        placeholder="e.g. 183"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[11px] text-gray-500 mb-1 block">
                        Total
                      </label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg">
                        {tier.quantity && tier.perItem
                          ? `Rs. ${(Number(tier.perItem) * Number(tier.quantity)).toLocaleString()}`
                          : "-"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setBulkPricing(
                          bulkPricing.filter((_, idx) => idx !== i),
                        )
                      }
                      className="text-red-500 hover:text-red-400 cursor-pointer mt-5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === "Images" && (
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Product Images*
                </label>
                <label className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 cursor-pointer w-fit">
                  <Upload size={16} /> Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleProductImgChange}
                  />
                </label>

                {productImgPreview.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                      const { active, over } = event;
                      if (active.id !== over?.id) {
                        const oldIndex = productImgPreview.indexOf(active.id);
                        const newIndex = productImgPreview.indexOf(over.id);
                        handleReorderImages(oldIndex, newIndex);
                      }
                    }}
                  >
                    <SortableContext
                      items={productImgPreview}
                      strategy={rectSortingStrategy}
                    >
                      <div className="flex flex-wrap mt-4 gap-3">
                        {productImgPreview.map((img, index) => (
                          <SortableImage
                            key={img}
                            img={img}
                            index={index}
                            onDelete={() => {
                              if (formData.productImages[index]) {
                                handleDeleteExistingImage(index);
                              } else {
                                handleDeleteImage(index);
                              }
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </div>

          <ModalActionButtons
            onCancel={handleCloseModal}
            onSaveAndClose={() => handleSave(true)}
            onSubmit={() => handleSave(false)}
            submitText="Save"
            saveAndCloseText={editItem ? "Update & Close" : "Save & Close"}
            isDisabled={!formData.title.trim() || !formData.price}
            isSubmitting={isSaving && !isSavingAndClose}
            isSavingAndClosing={isSaving && isSavingAndClose}
          />
        </div>
      </FullScreenModal>

      <CustomDeleteModal
        open={confirmModal.open}
        title={confirmModal.name}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal
        open={successModalOpen}
        message="Product deleted successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  );
};

export default ProductPage;
