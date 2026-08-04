import moment from "moment";
import { Link } from "react-router-dom";
import { useGetAllProducts } from "../hooks/useGetAllProducts";

const RecentProducts = () => {
  const { products = [] } = useGetAllProducts();

  return (
    <div className="overflow-x-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
        <div className="flex items-center gap-3">
          <Link to="/product">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 cursor-pointer">
              See all products
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 ">
          <thead className="bg-gray-50  text-xs uppercase text-gray-700 ">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Subcategory</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map((product) => (
              <tr key={product._id} className="border-b ">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 ">
                  <img
                    src={product?.productImages[0]?.url}
                    alt="Product"
                    className="w-8 h-8 object-fit rounded"
                  />
                </td>

                <td className="px-2 sm:px-6 py-4 truncate max-w-xs font-medium text-gray-900">
                  {product.title}
                </td>

                <td className="px-2 sm:px-6 py-4 truncate max-w-xs">
                  {product.categoryName}
                </td>

                <td className="px-2 sm:px-6 py-4 truncate max-w-xs">
                  {product.subCategoryName}
                </td>

                <td className="px-2 sm:px-6 py-4 truncate max-w-xs">
                  Rs. {product.price.toLocaleString()}
                </td>

                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                  {moment(product.updatedAt).format("DD MMM YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProducts;
