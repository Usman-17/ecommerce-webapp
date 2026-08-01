import { useQuery } from "@tanstack/react-query";

const fetchAuthUser = async () => {
  const res = await fetch("/api/auth/user", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
};

const useGetAuth = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: false,
  });
};

export default useGetAuth;
