import { useState } from "react";
import toast from "react-hot-toast";
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
import { uploadFile, apiRequest } from "../../../../../utils/authFetch";
// Imports End-----

const ProfileInfoDesktop = () => {
  const user = useUser();

  const [formData, setFormData] = useState({
    partyName: user?.partyName || "",
    email: user?.email || "",
    phoneNo1: user?.phoneNo1 || "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.logoImageURL || null);
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
    if (!formData.partyName.trim()) newErrors.partyName = "Name is required";
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

    // Just preview locally — upload happens on Save Changes
    setPendingImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      // Upload image first if a new one was selected
      let logoImageURL = user?.logoImageURL || "";
      let logoThumbImageURL = user?.logoThumbImageURL || "";

      if (pendingImageFile) {
        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("File", pendingImageFile);
        formDataUpload.append("UploadRequestFrom", "profile");
        const imgRes = await uploadFile(
          "/api/DBO/File/UploadFileWithThumb",
          formDataUpload,
        );
        setIsUploading(false);
        logoImageURL =
          imgRes.data?.webPURL ||
          imgRes.data?.imageURL ||
          imgRes.data?.url ||
          logoImageURL;
        logoThumbImageURL =
          imgRes.data?.thumbnailURL ||
          imgRes.data?.thumbURL ||
          logoThumbImageURL;
      }

      const payload = {
        partyId: user?.partyId || 0,
        partyLocationId: user?.partyLocationId || 0,
        addressId: user?.addressId || 0,
        loginUserId: user?.loginUserId || user?.partyId || 0,
        loginId: user?.loginId || user?.email || "",
        partyName: formData.partyName,
        phoneNo1: formData.phoneNo1,
        email: formData.email,
        logoImageURL,
        logoThumbImageURL,
        rowVersionLong: user?.rowVersionLong || 0,
      };

      await apiRequest("/api/CRM/CustomerWeb/Update", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const updatedUser = {
        ...user,
        partyName: formData.partyName,
        phoneNo1: formData.phoneNo1,
        email: formData.email,
        logoImageURL,
        logoThumbImageURL,
      };
      setUser(updatedUser);
      setPendingImageFile(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setIsUploading(false);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header + Photo Row */}
      <div className="relative flex items-center mb-8 px-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Profile Information
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Update your personal details.
          </p>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center shrink-0">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#FFE8D6] to-[#FFD6BA] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={user.partyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-[#CC0D39]">
                  {user.partyName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label
              htmlFor="profile-image-desktop"
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#CC0D39] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#B00C31] transition-colors"
            >
              {isUploading ? (
                <Loader size={12} className="animate-spin" />
              ) : (
                <Camera size={12} />
              )}
            </label>
            <input
              id="profile-image-desktop"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8 px-2">
        {/* Left — Form Inputs */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <CustomInput
            label="Full Name"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            placeholder="Enter your name"
            icon={User}
            error={errors.partyName}
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
            name="phoneNo1"
            type="tel"
            value={formData.phoneNo1}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={Phone}
            error={errors.phoneNo1}
          />

          <div className="flex items-center gap-3 p-4 bg-[#FFF0F0] rounded-lg border border-[#CC0D39]/10 mt-6">
            <div className="w-8 h-8 rounded-full bg-[#CC0D39]/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[#CC0D39]" />
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your information is secure and will only be used to improve your
              experience.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="py-3 px-8 bg-[#CC0D39] text-white rounded-md text-sm font-bold hover:bg-[#B00C31] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving || isUploading ? (
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfoDesktop;
