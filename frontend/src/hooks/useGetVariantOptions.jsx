const useGetVariantOptions = () => {
  return {
    colors: [],
    sizes: [],
    variantOptionsLoading: false,
    variantOptionsError: false,
    variantOptionsRefetch: () => {},
    variantOptionsIsRefetching: false,
  };
};

export { useGetVariantOptions };
