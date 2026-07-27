import { useMemo } from "react";

const useGlobalFilter = (data = [], searchValue = "", keys = []) => {
  return useMemo(() => {
    if (!searchValue) return data;

    const search = searchValue.toLowerCase();

    const matches = (val) => val?.toString().toLowerCase().includes(search);

    return data.filter((item) => keys.some((key) => matches(item[key])));
  }, [data, searchValue, keys]);
};

export default useGlobalFilter;
