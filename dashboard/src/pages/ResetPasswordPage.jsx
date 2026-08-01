import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShow, setIsShow] = useState(false);

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ token, newPassword }) => {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      return data;
    },

    onSuccess: () => {
      toast.success("Password reset successful!");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to reset password.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    resetPassword({ token, newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md sm:p-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-base text-gray-500 mt-2 px-4">
            Enter your new password below.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">
              Password reset successful!
            </p>
            <p className="text-xs text-green-600 mt-1">
              You can now log in with your new password.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm text-black font-medium hover:underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* New Password */}
            <div className="grid">
              <label htmlFor="newPassword" className="text-base font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={isShow ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  minLength={8}
                  className="w-full border border-gray-300 px-2 py-2 rounded text-black pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsShow(!isShow)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-black"
                  >
                    {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid">
              <label
                htmlFor="confirmPassword"
                className="text-base font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={isShow ? "text" : "password"}
                required
                placeholder="••••••••"
                minLength={8}
                className="border border-gray-300 px-2 py-2 rounded text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition cursor-pointer select-none"
                disabled={isPending}
              >
                {isPending ? (
                  <LoadingSpinner content="Resetting..." />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
