import { useState } from "react";
import { Lock, ArrowLeft, Loader, CheckCircle } from "lucide-react";

import CustomInput from "../../../components/CustomInput";
// Imports End-----

const ResetPassword = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = "Reset code is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // API call will be added later
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
      {/* Back Button */}
      <button
        onClick={onBackToLogin}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Sign In
      </button>

      {isSuccess ? (
        /* Success State */
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Password Reset!
          </h1>
          <p className="text-sm text-gray-500 font-medium mb-6">
            Your password has been successfully reset
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
          >
            Sign In
          </button>
        </div>
      ) : (
        /* Form State */
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#7C3AED]" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Enter the code from your email and set a new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Reset Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Enter reset code"
              error={errors.code}
            />

            <CustomInput
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a new password"
              icon={Lock}
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              icon={Lock}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
