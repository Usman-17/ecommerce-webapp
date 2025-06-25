import { useState } from "react";
import CustomInput from "../../components/CustomInput";
import CustomLabel from "../../components/CustomLabel";
import LoadingSpinner from "../../components/LoadingSpinner";

import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Imports End

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isShow, setIsShow] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token } = useParams();

  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationFn: async ({ newPassword }) => {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Reset password failed. Please try again."
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Password reset successfully.");
      navigate("/login");
    },

    onError: (error) => {
      toast.error(error.message || "An error occurred. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPasswordMutation({ newPassword });
  };

  const togglePassword = () => setIsShow(!isShow);

  return (
    <div className="flex justify-center items-center py-36 sm:py-28">
      <div className="w-full max-w-sm bg-[#fffaf5] px-4 py-8 rounded">
        <div className="grid gap-0 sm:gap-1 text-center mb-8">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-sm px-6 text-gray-500">
            Enter a new password to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password */}
          <div className="mb-6">
            <CustomLabel label="Password" />

            <div className="relative">
              <CustomInput
                type={isShow ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <div
                onClick={togglePassword}
                className="absolute top-6 right-5 transform -translate-y-1/2 flex items-center justify-center cursor-pointer text-gray-700"
              >
                {newPassword && (
                  <>{isShow ? <Eye size={18} /> : <EyeOff size={18} />}</>
                )}
              </div>
            </div>
          </div>

          {/* submit btn */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white bg-gray-950 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
          >
            {isPending ? <LoadingSpinner content="Submitting..." /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
