import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Mail, CheckCircle, ArrowRight, Inbox } from "lucide-react";

import CustomInput from "./CustomInput";
import GoogleButton from "./GoogleButton";

import logo from "../assets/logo.webp";
import { useAnalytics } from "../hooks/useAnalytics";
// Imports End-----

const AuthModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const modalRef = useRef(null);
  const prevIsOpen = useRef(isOpen);

  const { trackLogin, trackSignUp } = useAnalytics();

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
      trackLogin("google");
      toast.success("Signed in successfully!", { id: "auth" });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "auth" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      confirmPassword: "",
    });
    setErrors({});
    setForgotSent(false);
  };

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setView("login");
      resetForm();
    }
    prevIsOpen.current = isOpen;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = modal.querySelectorAll(focusableSelector);
    if (focusable.length > 0) focusable[0].focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const allFocusable = modal.querySelectorAll(focusableSelector);
      if (allFocusable.length === 0) return;
      const first = allFocusable[0];
      const last = allFocusable[allFocusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const switchView = (newView) => {
    setView(newView);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{11,}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgot = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = false;
    if (view === "login") valid = validateLogin();
    else if (view === "signup") valid = validateSignup();
    else if (view === "forgot") valid = validateForgot();

    if (!valid) return;

    setIsLoading(true);
    try {
      if (view === "login") {
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
        trackLogin("email");
        toast.success("Signed in successfully!", { id: "auth" });
        onClose();
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        window.dispatchEvent(new Event("userUpdated"));
      } else if (view === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            mobile: formData.phone,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        trackSignUp("email");
        toast.success("Account created successfully! Please sign in.", {
          id: "auth",
        });
        switchView("login");
      } else if (view === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setForgotSent(true);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "auth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          {/* ===== LOGIN VIEW ===== */}
          {view === "login" && (
            <>
              <div className="text-center mb-6">
                <h1
                  id="auth-modal-title"
                  className="text-2xl font-black text-gray-900 mb-1"
                >
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Social Login */}
              <div className="mb-6">
                <GoogleButton
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    toast.error("Google sign-in failed", { id: "auth" })
                  }
                />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  error={errors.email}
                />

                <div>
                  <div className="flex items-center justify-between ml-1 mb-0.5">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchView("forgot")}
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
                    error={errors.password}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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

              <p className="text-center text-sm text-gray-500 font-medium mt-6">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => switchView("signup")}
                  className="text-accent font-bold hover:text-accent/80 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {/* ===== SIGNUP VIEW ===== */}
          {view === "signup" && (
            <>
              <div className="text-center mb-5">
                <div className="flex justify-center mb-3">
                  <img src={logo} alt="JEMZY" className="h-10 object-contain" />
                </div>
                <h1
                  id="auth-modal-title"
                  className="text-2xl font-black text-gray-900 mb-1"
                >
                  Create Account
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Sign up to get started with JEMZY
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <CustomInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                />
                <div className="grid grid-cols-2 gap-3">
                  <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    error={errors.email}
                  />
                  <CustomInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03xx xxxxxxx"
                    error={errors.phone}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    error={errors.password}
                  />
                  <CustomInput
                    label="Confirm"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 font-medium mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => switchView("login")}
                  className="text-accent font-bold hover:text-accent/80 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </>
          )}

          {/* ===== FORGOT PASSWORD VIEW ===== */}
          {view === "forgot" && (
            <>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img
                    src="/src/assets/inbox.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-20 h-20 object-contain"
                  />
                </div>

                <h1
                  id="auth-modal-title"
                  className="text-2xl font-black text-gray-900 mb-2"
                >
                  Forgot Password?
                </h1>

                <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                  No worries! Enter your email and we&apos;ll send you a secure
                  link to reset your password.
                </p>
              </div>

              {forgotSent ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle
                      size={20}
                      className="text-green-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-bold text-green-800">
                        Reset link sent!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        We&apos;ve sent a password reset link to{" "}
                        <span className="font-semibold">{formData.email}</span>.
                        Check your inbox.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      window.open("https://mail.google.com", "_blank")
                    }
                    className="w-full py-3.5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Inbox size={16} />
                    Open Gmail
                  </button>

                  <button
                    onClick={() => {
                      resetForm();
                      switchView("login");
                    }}
                    className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <CustomInput
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    icon={Mail}
                    error={errors.email}
                  />

                  <div className="flex items-center gap-2 ml-1 mb-6">
                    <CheckCircle
                      size={14}
                      className="text-green-500 shrink-0"
                    />
                    <p className="text-[11px] text-gray-400 font-medium">
                      We&apos;ll only use your email to send you a password
                      reset link.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    Remember your password?{" "}
                    <button
                      onClick={() => switchView("login")}
                      className="text-accent font-bold hover:text-accent/80 transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
