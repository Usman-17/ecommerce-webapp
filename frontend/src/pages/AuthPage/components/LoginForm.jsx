import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import CustomInput from "../../../components/CustomInput";
import GoogleButton from "../../../components/GoogleButton";
// Imports End-----

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data, loginProvider: "email" }),
      );
      window.dispatchEvent(new Event("userUpdated"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "auth" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data, loginProvider: "google" }),
      );
      window.dispatchEvent(new Event("userUpdated"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Signed in successfully!", { id: "auth" });
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "auth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white py-22">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-500 font-medium">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-3 mb-6">
        <GoogleButton
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google sign-in failed", { id: "auth" })}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase">
          or
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email}
        />

        <div>
          <div className="flex items-center justify-between ml-1 mb-0.5">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <CustomInput
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="text-center text-sm text-gray-500 font-medium mt-6">
        Don&apos;t have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-accent font-bold hover:text-accent/80 transition-colors"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
