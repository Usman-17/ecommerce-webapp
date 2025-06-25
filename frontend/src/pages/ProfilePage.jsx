import CustomInput from "../components/CustomInput";
import CustomLabel from "../components/CustomLabel";
import SectionHeading from "../components/SectionHeading";
import LoadingSpinner from "../components/LoadingSpinner";

import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";

import useGetAuth from "../hooks/useGetAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Imports End

const ProfilePage = () => {
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowConfirmNewPassword, setIsConfirmNewPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    profileImg: "",
    fullName: "",
    mobile: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const queryClient = useQueryClient();
  const { data: authUser } = useGetAuth();

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        mobile: authUser.mobile,
        email: authUser.email,
        currentPassword: "",
        newPassword: "",
      });

      setPreviewUrl(authUser.profileImg?.url || "/avatar-placeholder.png");
    }
  }, [authUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update Profile Mutation
  const {
    mutateAsync: updateProfile,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (selectedImage) {
        formDataToSend.append("profileImg", selectedImage);
      }

      const res = await fetch(`/api/auth/profile/update`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update user profile");

      return data;
    },

    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["authUser"]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPending) {
      updateProfile();
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Profile | Jemzy</title>
        <meta
          name="description"
          content="Edit your Jemzy profile, name, mobile, image & password in one place."
        />
        <meta property="og:title" content="Update Profile | Jemzy" />
        <meta
          property="og:description"
          content="Manage your Jemzy account details quickly and securely."
        />
        <meta property="og:url" content="https://jemzy.pk/profile" />
        <meta
          property="og:image"
          content="https://jemzy.pk/assets/profile.jpg"
        />
      </Helmet>
      <div className="max-w-2xl sm:max-w-xl mx-auto px-2 py-6 sm:py-2 select-none">
        <div className="mb-2">
          <SectionHeading text1={"Update"} text2={"Profile"} />
        </div>

        <form className="space-y-1" onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewUrl || formData.profileImg || "/avatar.png"}
                alt="Profile Image"
                className="size-32 rounded-full object-cover border-4"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isPending ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isPending}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 mb-8">
              {isPending
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Full Name */}
            <div>
              <CustomLabel label="Full Name" />
              <CustomInput
                name="fullName"
                placeholder="Muhammad Usman"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            {/* Mobile */}
            <div>
              <CustomLabel label="Mobile" />
              <CustomInput
                name="mobile"
                placeholder="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                maxLength={11}
                minLength={11}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <CustomLabel label="Email" />
            <CustomInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Current Password */}
            <div className="relative">
              <CustomLabel label="Current Password" />
              <CustomInput
                type={isShowCurrentPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required={false}
              />

              <div
                onClick={() => setIsShowCurrentPassword((prev) => !prev)}
                className="absolute top-12 right-5 transform -translate-y-1/2 flex items-center justify-center cursor-pointer text-gray-700"
              >
                {formData.currentPassword && (
                  <>
                    {isShowCurrentPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* new Password */}
            <div className="relative mb-3 sm:mb-1">
              <CustomLabel label="New Password" />
              <CustomInput
                type={isShowConfirmNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                required={false}
              />

              <div
                onClick={() => setIsConfirmNewPassword((prev) => !prev)}
                className="absolute top-12 right-5 transform -translate-y-1/2 flex items-center justify-center cursor-pointer text-gray-700 "
              >
                {formData.newPassword && (
                  <>
                    {isShowConfirmNewPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-base-300 rounded-xl py-6">
            <h2 className="font-medium text-lg mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt &&
                    new Date(authUser.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          {isError && <div className="text-red-500">{error.message}</div>}

          <div className="pb-12">
            <button
              type="submit"
              disabled={isPending}
              className="w-full text-white bg-gray-950 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              {isPending ? (
                <LoadingSpinner content="Updating..." />
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
