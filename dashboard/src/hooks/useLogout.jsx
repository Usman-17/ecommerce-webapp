import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
        throw new Error(data.error || "Failed to logout");
      }

      return true;
    },

    onSuccess: () => {
      toast.success("Logout successful!");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/login");
    },

    onError: (error) => {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed");
    },
  });

  return { logoutMutation };
};

export default useLogout;
