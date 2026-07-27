import { useEffect, useState } from "react";
import { Undo, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import LoadingSpinner from "../components/LoadingSpinner";
import TipTapEditor from "../components/TipTapEditor";
import { useGetAllBrands } from "../hooks/useGetAllBrands";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
import { useGetAllAreas } from "../hooks/useGetAllAreas";
import { useGetSubCategoriesByCategory } from "../hooks/useGetSubCategoriesByCategory";

const tabs = ["Basic Info", "Description", "Variants", "Images"];

const emptyVariant = () => ({
  name: "",
  price: "",
  images: [],
  imagePreviews: [],
  existingImages: [],
});

const AddProductPage = () => {
  const [activeTab, setActiveTab] = useState("Basic Info");
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
    secondaryPrice: "",
    productImages: [],
    existingImages: [],
  });

  const [productImages, setProductImages] = useState([]);
  const [productImgPreview, setProductImgPreview] = useState([]);

  const [variants, setVariants] = useState([emptyVariant()]);

  const { id } = useParams();
  const navigate = useNavigate();

  const { brands = [] } = useGetAllBrands();
  const { categories = [] } = useGetAllCategories();
  const { areas = [] } = useGetAllAreas();
  const { subCategories = [] } = useGetSubCategoriesByCategory(formData.category);

  const filteredCategories = formData.area
    ? categories.filter((cat) => cat.area?._id === formData.area)
    : categories;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          area: data.area?._id || "",
          category: data.category?._id || "",
          subCategory: data.subCategory?._id || "",
          brand: data.brand?._id || "",
          tags: data.tags || [],
          price: data.price || "",
          secondaryPrice: data.secondaryPrice || "",
          sold: data.sold || "",
          productImages: data.productImages || [],
        });

        if (data.productImages) {
          setProductImgPreview(data.productImages.map((img) => img.url));
        }

        if (data.variants && data.variants.length > 0) {
          setVariants(
            data.variants.map((v) => ({
              _id: v._id,
              name: v.name || "",
              price: v.price ?? "",
              images: [],
              imagePreviews: (v.images || []).map((img) => img.url),
              existingImages: v.images || [],
            }))
          );
        }
      };
      fetchProduct();
    }
  }, [id]);

  const {
    mutate: saveProduct,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationFn: async (formDataToSend) => {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/product/update/${id}` : "/api/product/create";
      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }
      return data;
    },

    onSuccess: () => {
      toast.success(
        `Product "${formData.title.slice(0, 10)}" ${
          id ? "updated" : "created"
        } successfully`
      );

      navigate("/product/manage");
    },

    onError: (err) => {
      toast.error(err.message || `Failed to ${id ? "update" : "create"} Product`);
    },
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDescriptionChange = (newContent) =>
    setFormData({ ...formData, description: newContent });

  const handleSelectChange = (value, key) => {
    if (key === "area") {
      setFormData((prev) => ({ ...prev, area: value, category: "", subCategory: "" }));
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
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
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
          : v
      )
    );
  };

  const handleRemoveVariantImage = (variantIndex, imgIndex) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        const newImages = v.images.filter((_, j) => j !== imgIndex);
        const newPreviews = v.imagePreviews.filter((_, j) => j !== imgIndex);
        const newExisting = v.existingImages.filter((_, j) => j !== imgIndex);
        return {
          ...v,
          images: newImages,
          imagePreviews: newPreviews,
          existingImages: newExisting,
        };
      })
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);

  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") return;

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
        formDataToSend.append(`variant_${i}_images`, file);
      });
    });

    saveProduct(formDataToSend);
  };

  const tabBtnClass = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
      activeTab === tab
        ? "bg-white text-black border-b-2 border-black"
        : "text-gray-500 hover:text-black hover:bg-white/50"
    }`;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-0">
        <SectionHeading
          title={id ? "Edit Product" : "Add New Product"}
          subtitle="Fill out the details below to add a product"
        />
        <Button title="Manage Products" to="/product/manage" Icon={Undo} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex border-b border-neutral-700 mb-6">
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

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6 shadow">
          {/* Basic Info Tab */}
          {activeTab === "Basic Info" && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title*</label>
                <Input
                  placeholder="Enter Product Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Price*</label>
                  <Input
                    name="price"
                    type="number"
                    placeholder="Enter Product Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Secondary Price</label>
                  <Input
                    name="secondaryPrice"
                    type="number"
                    placeholder="Enter Secondary Price"
                    value={formData.secondaryPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Sold*</label>
                  <Input
                    placeholder="Enter number of products sold"
                    name="sold"
                    type="text"
                    value={formData.sold}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Area</label>
                    <Link
                      to="/area/create"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Add New Area
                    </Link>
                  </div>
                  <Select
                    className="w-full"
                    value={formData.area || undefined}
                    onChange={(value) => handleSelectChange(value, "area")}
                    placeholder="Select Area"
                    allowClear
                    showSearch
                  >
                    {areas.map((a) => (
                      <Select.Option key={a._id} value={a._id}>
                        {a.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Category*</label>
                    <Link
                      to="/category/create"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Add New Category
                    </Link>
                  </div>
                  <Select
                    className="w-full"
                    value={formData.category || undefined}
                    onChange={(value) => handleSelectChange(value, "category")}
                    placeholder="Select Category"
                    showSearch
                  >
                    {filteredCategories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">SubCategory</label>
                    <Link
                      to="/subcategory/create"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Add New SubCategory
                    </Link>
                  </div>
                  <Select
                    className="w-full"
                    value={formData.subCategory || undefined}
                    onChange={(value) => handleSelectChange(value, "subCategory")}
                    placeholder="Select SubCategory"
                    allowClear
                    showSearch
                  >
                    {subCategories.map((sc) => (
                      <Select.Option key={sc._id} value={sc._id}>
                        {sc.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Brand</label>
                    <Link
                      to="/brand/create"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Add New Brand
                    </Link>
                  </div>
                  <Select
                    className="w-full"
                    value={formData.brand}
                    onChange={(value) => handleSelectChange(value, "brand")}
                    placeholder="Select Brand"
                    showSearch
                  >
                    {brands.map((b) => (
                      <Select.Option key={b._id} value={b._id}>
                        {b.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Tags</label>
                  <Select
                    mode="tags"
                    className="w-full"
                    value={formData.tags}
                    placeholder="Enter or Select Tags"
                    onChange={(value) => handleSelectChange(value, "tags")}
                    tokenSeparators={[","]}
                  >
                    {["Special", "Popular", "Sale"].map((tag) => (
                      <Select.Option key={tag} value={tag}>
                        {tag}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
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
                onChange={handleDescriptionChange}
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
                  className="border border-neutral-200 rounded-lg p-4 space-y-3"
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
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Name*
                      </label>
                      <Input
                        placeholder="e.g. Large / Red"
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(vi, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Price
                      </label>
                      <Input
                        type="number"
                        placeholder="Variant price"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(vi, "price", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Variant images */}
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
                              alt={`variant-${vi}-img-${ii}`}
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
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleProductImgChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0 file:text-sm file:font-semibold
                  file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
              />

              {productImgPreview.length > 0 && (
                <div className="flex flex-wrap mt-4 gap-3">
                  {productImgPreview.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`preview-${index}`}
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
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full 
                        w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer"
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

        {isError && <div className="text-red-600 mt-2">{error.message}</div>}

        <div className="pt-5">
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900
           disabled:opacity-50 w-full cursor-pointer"
          >
            {isPending ? (
              <LoadingSpinner content="Saving..." />
            ) : (
              <>{id ? "Update Product" : "Create Product"}</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProductPage;
