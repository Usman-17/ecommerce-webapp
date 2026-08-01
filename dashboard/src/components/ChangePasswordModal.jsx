import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

const ChangePasswordModal = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsShow(false);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const res = await fetch("/api/auth/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to change password.");

      return data;
    },

    onSuccess: () => {
      toast.success("Password changed successfully!");
      onClose();
    },

    onError: (error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    changePassword({ currentPassword, newPassword });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Enter your current and new password below.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Current Password */}
          <div className="grid">
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={isShow ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-black pr-10 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="grid">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={isShow ? "text" : "password"}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-black pr-10 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={isShow ? "text" : "password"}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-black pr-10 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center gap-2 -mt-1">
            <input
              id="showPw"
              type="checkbox"
              checked={isShow}
              onChange={(e) => setIsShow(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
            />
            <label
              htmlFor="showPw"
              className="text-sm text-gray-500 cursor-pointer select-none"
            >
              Show passwords
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner content="Saving..." /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
