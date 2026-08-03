import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader,
  Save,
  ShieldCheck,
} from "lucide-react";

import CustomInput from "../../../../../components/CustomInput";
import { useUser, setUser } from "../../../../../hooks/useUser";
// Imports End-----

const ProfileInfo = () => {
  const navigate = useNavigate();
  const user = useUser();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImg?.url || null,
  );
  const [pendingImageFile, setPendingImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setPendingImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const body = new FormData();
      body.append("fullName", formData.fullName);
      body.append("mobile", formData.mobile);
      if (pendingImageFile) {
        body.append("profileImg", pendingImageFile);
      }

      const res = await fetch(`/api/auth/profile/update`, {
        method: "PUT",
        credentials: "include",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser(data.user);
      setPendingImageFile(null);
      setPreviewImage(data.user.profileImg?.url || previewImage);
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-white py-2">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-0 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Profile Information
          </h1>

          <p className="text-xs text-gray-400 font-medium">
            Update your personal details.
          </p>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-linear-to-br from-[#FFE8D6] to-[#FFD6BA] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-[#CC0D39]">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#CC0D39] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#B00C31] transition-colors"
            >
              <Camera size={14} />
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mt-3">
            Profile Photo
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Tap to change your photo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            icon={User}
            error={errors.fullName}
            required
          />

          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={Mail}
            error={errors.email}
            required
            disabled
            helperText="Email cannot be changed"
          />

          <CustomInput
            label="Phone Number"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={Phone}
            error={errors.mobile}
          />

          <div className="flex items-center gap-3 p-4 bg-[#FFF0F0] rounded-xl border border-[#CC0D39]/10 mt-4">
            <div className="w-8 h-8 rounded-full bg-[#CC0D39]/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[#CC0D39]" />
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your information is secure and will only be used to improve your
              experience.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-[#CC0D39] text-white rounded-xl text-sm font-bold hover:bg-[#B00C31] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSaving ? (
              <>
                <Loader size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
