import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { Lock, Loader, Save } from "lucide-react";

import { useUser } from "../../../../../hooks/useUser";
import CustomInput from "../../../../../components/CustomInput";
// Imports End-----

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "text-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "text-orange-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "text-yellow-500" };
  if (score <= 4) return { score: 4, label: "Strong", color: "text-green-500" };
  return { score: 5, label: "Very Strong", color: "text-emerald-600" };
};

const ChangePassword = () => {
  const user = useUser();
  const isGoogleUser = user?.loginProvider === "google";

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.newPassword),
    [formData.newPassword],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isGoogleUser && !formData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/auth/profile/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full overflow-hidden bg-white py-4 sm:py-0">
      {/* Header */}
      <div className="flex items-center gap-3  px-4 sm:px-2 pb-1 sm:pb-0">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Change Password
          </h1>
          <p className="max-w-50 text-xs font-medium leading-5 text-gray-400">
            Keep your account secure by using a strong and unique password.
          </p>
        </div>
      </div>

      <div className="px-2 mt-4">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isGoogleUser && (
            <CustomInput
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              icon={Lock}
              error={errors.currentPassword}
              required
              helperText="Enter The password you use to sign in."
            />
          )}

          <CustomInput
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            icon={Lock}
            error={errors.newPassword}
            required
            helperText="Must be at least 8 characters long."
          />

          {formData.newPassword && (
            <div className="flex items-center gap-3 ml-1">
              <span className="text-[11px] text-gray-500 font-medium">
                Password strength:
              </span>
              <span
                className={`text-[11px] font-bold ${passwordStrength.color}`}
              >
                {passwordStrength.label}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                      i <= passwordStrength.score
                        ? passwordStrength.score <= 1
                          ? "bg-red-500"
                          : passwordStrength.score <= 2
                            ? "bg-orange-500"
                            : passwordStrength.score <= 3
                              ? "bg-yellow-500"
                              : passwordStrength.score <= 4
                                ? "bg-green-500"
                                : "bg-emerald-600"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <CustomInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            icon={Lock}
            error={errors.confirmPassword}
            required
            helperText="Re-enter your new password to confirm."
          />

          {/* Tips */}
          <div className="mt-6 p-4 bg-[#FFF0F0] border border-[#CC0D39]/10  rounded-xl">
            <h4 className="text-xs font-bold text-gray-700 mb-2">
              Password Tips
            </h4>

            <ul className="space-y-1.5">
              {[
                "Use at least 8 characters",
                "Include uppercase and lowercase letters",
                "Include numbers and special characters",
                "Avoid using personal information",
                "Don't reuse passwords from other sites",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-gray-500 font-medium">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-[#CC0D39] text-white rounded-xl text-sm font-bold hover:bg-[#B00C31] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSaving ? (
              <>
                <Loader size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Password
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400 font-medium mt-3 flex items-center justify-center gap-1.5">
            <Lock size={12} />
            Your information is encrypted and secure.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
