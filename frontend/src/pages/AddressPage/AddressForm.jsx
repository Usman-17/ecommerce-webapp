import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Phone, MapPin, Mail, Globe, Settings2 } from "lucide-react";

import MapIcon from "../../assets/map.png";
import HomeIcon from "../../assets/home.png";
import OfficeIcon from "../../assets/office.png";

import CustomInput from "../../components/CustomInput";

import AddressTypeSelector from "./components/AddressTypeSelector";

import { errorVibrate, successVibrate } from "../../utils/vibrate";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const AddressForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const addressId = searchParams.get("id");
  const isEditMode = !!addressId;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: "home",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;
    fetch(`${API_BASE}/api/auth/addresses`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const addr = (data.addresses || []).find((a) => a._id === addressId);
        if (addr) {
          setFormData({
            type: addr.type || "home",
            fullName: addr.fullName || "",
            phone: addr.phone || "",
            email: addr.email || "",
            address: addr.address || "",
            city: addr.city || "",
            isDefault: addr.isDefault || false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [addressId, isEditMode]);

  const addressTypeOptions = [
    {
      value: "home",
      label: "Home",
      icon: HomeIcon,
      description: "Your home address",
    },
    {
      value: "office",
      label: "Office",
      icon: OfficeIcon,
      description: "Your work address",
    },
    {
      value: "other",
      label: "Other",
      icon: MapIcon,
      description: "Another address",
    },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (Object.keys(newErrors).length > 0) {
      errorVibrate();
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = isEditMode
        ? `${API_BASE}/api/auth/addresses/${addressId}`
        : `${API_BASE}/api/auth/addresses`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      successVibrate();
      navigate("/profile/addresses");
    } catch (err) {
      errorVibrate();
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="-mt-2 sm:mt-0 flex-1">
        <div className="bg-white p-4 rounded-lg sm:p-4 sm:min-h-full">
          <div className="hidden sm:flex items-center gap-4 mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 flex-1 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-2 sm:mt-0 flex-1">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg sm:p-4 sm:min-h-full flex flex-col"
      >
        {/* Desktop Header — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEditMode ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Add a new address to make your deliveries faster and easier.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 sm:space-y-4">
          <AddressTypeSelector
            value={formData.type}
            options={addressTypeOptions}
            onChange={(value) =>
              handleChange({ target: { name: "type", value } })
            }
          />

          <div className="space-y-1.5">
            <CustomInput
              type="text"
              name="fullName"
              label="Full Name"
              required
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.fullName}
            />
          </div>

          {/* Phone + Email side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <CustomInput
                type="tel"
                name="phone"
                label="Phone Number"
                required
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                maxLength={11}
                inputMode="tel"
                error={errors.phone}
              />
            </div>

            <div className="space-y-1.5">
              <CustomInput
                type="email"
                name="email"
                label="Email (Optional)"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <CustomInput
              type="text"
              name="city"
              label="City"
              required
              icon={Globe}
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              error={errors.city}
            />
          </div>

          <div className="space-y-1.5">
            <CustomInput
              label="Complete Address"
              name="address"
              required
              icon={MapPin}
              type="textarea"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No, Street, Area..."
              rows={3}
              error={errors.address}
              inputClassName="px-3 py-2"
            />
          </div>

          {/* Default Address Switch */}
          <div className="flex items-center justify-between py-3 px-3 sm:px-6 sm:py-4 bg-gray-50/80 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl text-gray-400">
                <Settings2 size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700">
                  Set as default
                </p>
                <p className="text-[11px] text-gray-500 max-w-[80%] sm:max-w-full">
                  This address will be used as default.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                formData.isDefault ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isDefault ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button — pushed to bottom */}
        <div className="flex justify-end gap-3 pt-4 sm:pt-6">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 rounded-lg sm:rounded-md bg-[#CC0D39] text-white font-bold text-sm hover:bg-[#B00C31] transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditMode ? (
              "Update Address"
            ) : (
              "Save Address"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
