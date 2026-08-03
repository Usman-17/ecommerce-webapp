import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Loader, Camera } from "lucide-react";

import { apiRequest, uploadFile } from "../../../utils/authFetch";

import CustomInput from "../../../components/CustomInput";
// Imports End-----

const SignupForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
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
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      let logoImageURL = "";
      let logoThumbImageURL = "";
      if (profileImage) {
        const imageForm = new FormData();
        imageForm.append("File", profileImage);
        imageForm.append("UploadRequestFrom", "signup");
        const imgRes = await uploadFile(
          "/api/DBO/File/UploadFileWithThumb",
          imageForm,
        );
        logoImageURL = imgRes.data.fileURL || "";
        logoThumbImageURL = imgRes.data.thumbnailURL || "";
      }
      await apiRequest("/api/CRM/Customer/SignUp", {
        method: "POST",
        body: JSON.stringify({
          partyName: formData.name,
          phoneNo1: formData.phone,
          email: formData.email,
          logoImageURL,
          logoThumbImageURL,
          loginId: formData.email,
          loginPassword: formData.password,
          rowVersionLong: 0,
        }),
      });
      toast.success("Account created successfully! Please sign in.", {
        id: "auth",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "auth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Sign up to get started with JEMZY
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image Upload */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="relative w-18 h-18 rounded-full bg-linear-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-accent hover:bg-accent/5 transition-all duration-300 overflow-hidden group"
          >
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera
                  size={20}
                  className="text-gray-400 group-hover:text-accent transition-colors duration-300"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
              <Camera size={18} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <CustomInput
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          icon={User}
          error={errors.name}
        />

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

        <CustomInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="03xx xxxxxxx"
          icon={Phone}
          error={errors.phone}
        />

        <CustomInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a password"
          icon={Lock}
          error={errors.password}
        />

        <CustomInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
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
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="text-center text-sm text-gray-500 font-medium mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-accent font-bold hover:text-accent/80 transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
