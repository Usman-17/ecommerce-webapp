import { useEffect, useState } from "react";
import { Undo } from "lucide-react";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { useGetAllCategories } from "../hooks/useGetAllCategories";

const AddSubCategoryPage = () => {
  const [formData, setFormData] = useState({ name: "", category: "" });

  const { id } = useParams();
  const navigate = useNavigate();
  const { categories = [] } = useGetAllCategories();

  useEffect(() => {
    if (id) {
      const fetchSubCategory = async () => {
        try {
          const res = await fetch(`/api/subcategory/${id}`);
          const data = await res.json();
          setFormData({
            name: data.name || "",
            category: data.category?._id || "",
          });
        } catch (error) {
          console.error("Error fetching subcategory:", error);
          toast.error("Failed to fetch subcategory data");
        }
      };
      fetchSubCategory();
    }
  }, [id]);

  const {
    mutate: saveSubCategory,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationFn: async (formData) => {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `/api/subcategory/update/${id}`
        : "/api/subcategory/create";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save subcategory");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success(
        `SubCategory "${formData.name}" ${
          id ? "updated" : "created"
        } successfully`
      );
      navigate("/subcategory/manage");
    },

    onError: () => {
      toast.error(`Failed to ${id ? "update" : "create"} subcategory`);
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    saveSubCategory(formDataToSend);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-0">
        <SectionHeading
          title={id ? "Edit SubCategory" : "Add New SubCategory"}
          subtitle="Fill out the details below to add a subcategory"
        />

        <Button
          title="Manage All SubCategories"
          to="/subcategory/manage"
          Icon={Undo}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block mb-1 font-medium text-sm text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter SubCategory Name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Category*
            </label>
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
            onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            placeholder="Select Category"
            required
            showSearch
          >
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {isError && <p className="text-sm text-red-600">{error?.message}</p>}

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-900
           disabled:opacity-50 w-full cursor-pointer"
          >
            {isPending ? (
              <LoadingSpinner content="Saving..." />
            ) : (
              <>{id ? "Update SubCategory" : "Add SubCategory"}</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSubCategoryPage;
