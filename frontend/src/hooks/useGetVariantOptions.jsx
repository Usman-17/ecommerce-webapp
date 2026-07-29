import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/authFetch";

const useGetVariantOptions = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["variantOptions"],
    queryFn: () => apiRequest("/api/ISPM/VariantOption/GetForWeb"),

    retry: false,
  });

  const rawData = Array.isArray(data?.data) ? data.data : [];

  const colors = rawData
    .find((group) => group.optionTypeId === 10)
    ?.options.map((opt) => ({
      colorId: opt.variantOptionId,
      colorName: opt.optionName,
      hexCode: opt.hexCode,
    })) || [];

  const sizes = rawData
    .find((group) => group.optionTypeId === 12)
    ?.options.map((opt) => ({
      sizeId: opt.variantOptionId,
      sizeName: opt.optionName,
    })) || [];

  return {
    colors,
    sizes,
    variantOptionsLoading: isLoading,
    variantOptionsError: isError,
    variantOptionsRefetch: refetch,
    variantOptionsIsRefetching: isRefetching,
  };
};

export { useGetVariantOptions };
