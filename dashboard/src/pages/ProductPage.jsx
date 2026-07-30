import toast from "react-hot-toast";
import { useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { SquarePen, Plus, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import TagsInput from "../components/TagsInput";
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

const tabs = ["Basic Info", "Description", "Variants", "Images"];

const emptyVariant = () => ({
  name: "",
  price: "",
  images: [],
  imagePreviews: [],
  existingImages: [],
});

const ProductPage = () => {
  const queryClient = useQueryClient();
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
    price: "",
    purchasePrice: "",
    secondaryPrice: "",
    productImages: [],
    existingImages: [],
  });

  const [productImages, setProductImages] = useState([]);
  const [productImgPreview, setProductImgPreview] = useState([]);
  const [variants, setVariants] = useState([emptyVariant()]);

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
      price: "",
      purchasePrice: "",
      secondaryPrice: "",
      productImages: [],
      existingImages: [],
    });
    setProductImages([]);
    setProductImgPreview([]);
    setVariants([emptyVariant()]);
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
        price: data.price || "",
        purchasePrice: data.purchasePrice || "",
        secondaryPrice: data.secondaryPrice || "",
        sold: data.sold || "",
        productImages: data.productImages || [],
        existingImages: data.productImages || [],
      });

      setProductImgPreview(data.productImages?.map((img) => img.url) || []);
      setProductImages([]);

      if (data.variants && data.variants.length > 0) {
        setVariants(
          data.variants.map((v) => {
            const variantImages = v.images || (v.image ? [v.image] : []);
            return {
              _id: v._id,
              name: v.name || "",
              price: v.price ?? "",
              images: [],
              imagePreviews: variantImages.map((img) => img.url),
              existingImages: variantImages,
            };
          }),
        );
      } else {
        setVariants([emptyVariant()]);
      }

      setEditItem(record);
      setActiveTab("Basic Info");
      setAddModal(true);
    } catch {
      toast.error("Failed to load product");
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
      price: "",
      purchasePrice: "",
      secondaryPrice: "",
      productImages: [],
      existingImages: [],
    });
    setProductImages([]);
    setProductImgPreview([]);
    setVariants([emptyVariant()]);
    setActiveTab("Basic Info");
  };

  const handleSave = (saveAndClose = true) => {
    isSavingAndCloseRef.current = saveAndClose;
    setIsSavingAndClose(saveAndClose);

    const missingFields = [];
    if (!formData.title.trim()) missingFields.push("Title");
    if (!formData.price) missingFields.push("Price");
    if (!formData.description.trim()) missingFields.push("Description");
    if (!formData.tags || formData.tags.length === 0)
      missingFields.push("Tags");

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

    const variantsForApi = variants.map((v) => {
      const cleaned = {
        name: v.name,
        price: v.price !== "" ? Number(v.price) : undefined,
      };
      if (v._id) cleaned._id = v._id;
      if (v.existingImages.length > 0) {
        cleaned.images = v.existingImages;
      }
      return cleaned;
    });

    formDataToSend.append("variants", JSON.stringify(variantsForApi));

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
      title: "Sr No.",
      dataIndex: "sr",
      key: "sr",
      width: 70,
      align: "center",
      sorter: (a, b) => a.sr - b.sr,
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      width: 80,
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
      width: 300,
      render: (text) => (
        <span className="block max-w-[300px] truncate" title={text}>
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
      title: "Purchase Price",
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
      title: "Secondary Price",
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
    `px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-500 hover:text-black"
    }`;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeading title="Products" subtitle="Manage Products below" />
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer text-sm font-medium"
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
          <div className="flex border-b border-gray-200 mb-4">
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-9">
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
                  <div className="sm:col-span-3">
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

                <TagsInput
                  label="Tags"
                  required
                  value={formData.tags}
                  onChange={(val) => handleSelectChange(val, "tags")}
                />
              </div>
            )}

            {/* Description Tab */}
            {activeTab === "Description" && (
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Product Description*
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
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Variant {vi + 1}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(vi)}
                          className="text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomInput
                        id={`variantName-${vi}`}
                        label="Name"
                        required
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(vi, "name", e.target.value)
                        }
                        placeholder="e.g. Large / Red"
                      />
                      <CustomInput
                        id={`variantPrice-${vi}`}
                        label="Price"
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(vi, "price", e.target.value)
                        }
                        placeholder="Variant price"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Variant Images
                      </label>
                      <label className="flex items-center gap-2 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-neutral-800 cursor-pointer w-fit">
                        <Upload size={14} /> Upload Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleVariantImageChange(vi, e)}
                        />
                      </label>
                      {variant.imagePreviews.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-2">
                          {variant.imagePreviews.map((img, ii) => (
                            <div key={ii} className="relative group">
                              <img
                                src={img}
                                alt=""
                                className="w-16 h-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(vi, ii)}
                                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-700 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <div className="flex flex-wrap mt-4 gap-3">
                    {productImgPreview.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt=""
                          className="w-24 h-24 object-cover rounded shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.productImages[index]) {
                              handleDeleteExistingImage(index);
                            } else {
                              handleDeleteImage(index);
                            }
                          }}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
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
            isDisabled={
              !formData.title.trim() ||
              !formData.price ||
              !formData.description.trim() ||
              !formData.tags ||
              formData.tags.length === 0
            }
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
