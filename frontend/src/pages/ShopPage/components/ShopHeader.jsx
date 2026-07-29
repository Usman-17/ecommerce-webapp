import { Link } from "react-router-dom";
import filterIcon from "../../../assets/filter.png";
import Breadcrumbs from "../../../components/common/Breadcrumbs";

const ShopHeader = ({
  breadcrumbLabel,
  areaParam,
  categoryParam,
  subcategoryParam,
  areaCategories,
  categorySubCategories,
  toggleMobileFilter,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="lg:hidden text-xl font-bold text-gray-800">
          {breadcrumbLabel || "Shop"}
        </h1>

        <button
          onClick={toggleMobileFilter}
          className="lg:hidden flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 text-gray-700 active:bg-gray-50 rounded-full transition-all duration-200 ml-auto"
        >
          <img
            src={filterIcon}
            alt="Filter"
            className="w-4 h-4 object-contain"
          />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-2 mt-1 sm:mt-0">
        <Breadcrumbs
          items={[
            { label: "Shop", path: "/shop" },
            ...(areaParam
              ? [
                  {
                    label: areaParam,
                    path: `/shop?area=${encodeURIComponent(areaParam)}`,
                  },
                  ...(categoryParam
                    ? [
                        {
                          label: categoryParam,
                          path: `/shop?area=${encodeURIComponent(areaParam)}&category=${encodeURIComponent(categoryParam)}`,
                        },
                      ]
                    : []),
                  ...(subcategoryParam
                    ? [
                        {
                          label: subcategoryParam,
                          path: `/shop?area=${encodeURIComponent(areaParam)}&category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subcategoryParam)}`,
                        },
                      ]
                    : []),
                ]
              : []),
            ...(categoryParam && !areaParam
              ? [
                  {
                    label: categoryParam,
                    path: `/shop?category=${encodeURIComponent(categoryParam)}`,
                  },
                  ...(subcategoryParam
                    ? [
                        {
                          label: subcategoryParam,
                          path: `/shop?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subcategoryParam)}`,
                        },
                      ]
                    : []),
                ]
              : []),
            ...(subcategoryParam && !areaParam && !categoryParam
              ? [
                  {
                    label: subcategoryParam,
                    path: `/shop?subcategory=${encodeURIComponent(subcategoryParam)}`,
                  },
                ]
              : []),
          ]}
        />
      </div>

      {/* Area Categories Grid */}
      {areaParam && !categoryParam && areaCategories.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {areaCategories.map((cat) => {
              const isActive = categoryParam === cat.productCategoryName;
              return (
                <Link
                  key={cat.productCategoryId}
                  to={`/shop?area=${encodeURIComponent(areaParam)}&category=${encodeURIComponent(cat.productCategoryName)}`}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      isActive
                        ? "border-[#CC0D39] shadow-md"
                        : "border-gray-100 group-hover:border-[#CC0D39]/30"
                    }`}
                  >
                    <img
                      src={cat.categoryImageURL || "/category.png"}
                      alt={cat.productCategoryName}
                      onError={(e) => {
                        e.currentTarget.src = "/category.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 max-w-20 sm:max-w-30 transition-colors ${
                      isActive
                        ? "text-[#CC0D39]"
                        : "text-gray-600 group-hover:text-[#CC0D39]"
                    }`}
                  >
                    {cat.productCategoryName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Subcategory Grid */}
      {categoryParam && categorySubCategories.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {categorySubCategories.map((sub) => {
              const isActive = subcategoryParam === sub.productSubCategoryName;
              const areaParamStr = areaParam
                ? `&area=${encodeURIComponent(areaParam)}`
                : "";
              return (
                <Link
                  key={sub.productSubCategoryId}
                  to={`/shop?category=${encodeURIComponent(categoryParam)}${areaParamStr}${isActive ? "" : `&subcategory=${encodeURIComponent(sub.productSubCategoryName)}`}`}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      isActive
                        ? "border-[#CC0D39] shadow-md"
                        : "border-gray-100 group-hover:border-[#CC0D39]/30"
                    }`}
                  >
                    <img
                      src={sub.subCategoryImageURL || "/category.png"}
                      alt={sub.productSubCategoryName}
                      onError={(e) => {
                        e.currentTarget.src = "/category.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 max-w-20 sm:max-w-30 transition-colors ${
                      isActive
                        ? "text-[#CC0D39]"
                        : "text-gray-600 group-hover:text-[#CC0D39]"
                    }`}
                  >
                    {sub.productSubCategoryName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopHeader;
