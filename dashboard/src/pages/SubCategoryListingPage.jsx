import moment from "moment";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Trash2, Redo, SquarePen } from "lucide-react";

import SectionHeading from "../components/SectionHeading";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Button from "../components/Button";

const SubCategoryListingPage = () => {
  const queryClient = useQueryClient();

  const {
    data: subCategories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subCategories"],
    queryFn: async () => {
      const response = await fetch("/api/subcategory/all");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/subcategory/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete subcategory");
      return res.json();
    },
    onSuccess: () => {
      toast.success("SubCategory deleted successfully");
      queryClient.invalidateQueries(["subCategories"]);
    },
    onError: () => toast.error("Failed to delete subcategory"),
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-0">
        <SectionHeading
          title="SubCategories"
          subtitle="Manage SubCategories below"
        />

        <Button
          title="Create New SubCategory"
          to="/subcategory/create"
          Icon={Redo}
        />
      </div>

      {error && (
        <p className="text-red-600 font-medium mb-4">{error.message}</p>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : subCategories.length > 0 ? (
        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-2 sm:px-6 py-4 text-left text-nowrap">
                  Sr No.
                </th>
                <th className="px-2 sm:px-6 py-4 text-left">Name</th>
                <th className="px-2 sm:px-6 py-4 text-left">Category</th>
                <th className="px-2 sm:px-6 py-4 text-left">Action</th>
                <th className="px-2 sm:px-6 py-4 text-left">Updated Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subCategories.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 sm:px-10 py-4 font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-2 sm:px-6 py-4 truncate max-w-xs">
                    {sub.name}
                  </td>
                  <td className="px-2 sm:px-6 py-4 truncate max-w-xs">
                    {sub.category?.name || "-"}
                  </td>

                  <td className="px-2 sm:px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/subcategory/edit/${sub._id}`}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="Edit SubCategory"
                      >
                        <SquarePen
                          size={20}
                          className="text-blue-600 hover:text-blue-800"
                        />
                      </Link>

                      <button
                        onClick={() => handleDelete(sub._id)}
                        disabled={deleteMutation.isLoading}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete SubCategory"
                      >
                        <Trash2
                          size={20}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>
                    </div>
                  </td>

                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    {moment(sub.updatedAt).format("DD MMM YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 text-lg">
          No subcategories available
        </div>
      )}
    </>
  );
};

export default SubCategoryListingPage;
