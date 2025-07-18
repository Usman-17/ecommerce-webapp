import { useState } from "react";

import CustomInput from "../../components/CustomInput";
import CustomLabel from "../../components/CustomLabel";
import LoadingSpinner from "../../components/LoadingSpinner";

import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// Imports End

const SignupPage = () => {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: async ({ fullName, email, mobile, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobile, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create account");
      return data;
    },

    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setIsShow(!isShow);
  };

  return (
    <div className="flex justify-center items-center py-3 sm:py-7">
      <div className="w-full max-w-md px-4 py-4">
        <div className="grid gap-2 text-center mb-7">
          <h1 className="text-4xl font-bold">Signup</h1>
          <p className="text-sm px-6 text-gray-500">
            Enter your details below to create your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-1 mb-2 sm:mb-3">
            {/*  Name */}
            <div className="mb-1 sm:mb-0">
              <CustomLabel label={"Full Name"} />
              <CustomInput
                name="fullName"
                placeholder="Enter your full name"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </div>

            {/* Mobile */}
            <div>
              <CustomLabel label={"Mobile"} />
              <CustomInput
                name="mobile"
                inputMode="numeric"
                minLength={11}
                maxLength={11}
                placeholder="03000000000"
                onChange={handleInputChange}
                value={formData.mobile}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <CustomLabel label={"Email"} />
            <CustomInput
              type="email"
              name="email"
              placeholder="m@example.com"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>

          {/* Password */}
          <div className="mb-4 sm:mb-6">
            <CustomLabel label={"Password"} />
            <div className="relative">
              <CustomInput
                type={isShow ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleInputChange}
                value={formData.password}
              />

              {formData.password && (
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-6 right-5 transform -translate-y-1/2 cursor-pointer text-gray-700"
                >
                  {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              )}
            </div>
          </div>

          {/* Signup & Login Button */}
          <div className="flex items-center justify-between gap-3 flex-col">
            <button
              type="submit"
              disabled={isPending}
              className="w-full text-white bg-gray-950 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              {isPending ? (
                <LoadingSpinner content="Signing up..." />
              ) : (
                "Signup"
              )}
            </button>

            <Link
              to="/login"
              className="w-full text-gray-800 border border-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
