import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  Navigation,
  SquarePen,
  MapPin,
} from "lucide-react";

import EmptyDeliveryAddress from "./EmptyDeliveryAddress";

import { errorVibrate } from "../../../utils/vibrate";
import useCurrentLocation from "../../../hooks/useCurrentLocation";

import CustomInput from "../../../components/CustomInput";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
// Imports End---

const DeliveryInfo = ({
  formik,
  addresses,
  selectedAddress,
  setSelectedAddress,
  isChangingAddress,
  setIsChangingAddress,
  onSaveAddress,
  shakeSignal,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const {
    loading: locating,
    error: locError,
    errorType,
    location,
    detect,
  } = useCurrentLocation();

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setIsChangingAddress(false);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setIsChangingAddress(true);
    document
      .getElementById("delivery-address")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    formik.setValues({
      ...formik.values,
      userName: "",
      contactNo: "",
      contactEmail: "",
      contactAddress: "",
      city: "",
    });
  };

  return (
    <div
      id="delivery-address"
      className="bg-white p-4 sm:p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Delivery Address
          </h2>
        </div>
        {(selectedAddress || addresses.length > 0) && !isChangingAddress && (
          <button
            type="button"
            onClick={() => setIsChangingAddress(true)}
            className="text-sm font-bold text-accent hover:text-accent/80 transition-colors"
          >
            Change
          </button>
        )}
      </div>

      {selectedAddress && !isChangingAddress ? (
        <div className="p-4 sm:p-6 rounded-xl border border-gray-100 bg-[#fff8f8]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-accent text-lg">
                {selectedAddress.name}
              </span>
              {selectedAddress.type && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent rounded">
                  {selectedAddress.type}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <p className="text-gray-700 font-medium">
                {selectedAddress.phone}
              </p>
              {selectedAddress.email && (
                <>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <p className="text-gray-600">{selectedAddress.email}</p>
                </>
              )}
            </div>
            <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
              {selectedAddress.address}, {selectedAddress.city}
            </p>
          </div>
        </div>
      ) : isChangingAddress ? (
        <div className="space-y-4">
          {addresses.length > 0 && !isAddingNew ? (
            <div className="grid grid-cols-1 gap-3">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleAddressSelect(addr)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedAddress?.id === addr.id
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{addr.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {addr.address}, {addr.city}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-gray-300 text-gray-800 hover:border-accent hover:text-accent transition-all font-medium text-xs"
              >
                <SquarePen className="w-4 h-4" />
                Add New Address
              </button>
            </div>
          ) : (
            <div
              key={shakeSignal}
              className={`grid grid-cols-1 gap-4 sm:gap-6 pt-2${shakeSignal ? " animate-shake" : ""}`}
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <CustomInput
                  type="text"
                  name="userName"
                  label="Full Name"
                  required
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your full name"
                  icon={User}
                  error={
                    formik.touched.userName && formik.errors.userName
                      ? formik.errors.userName
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                {/* Phone */}
                <div className="space-y-1.5">
                  <CustomInput
                    type="text"
                    name="contactNo"
                    label="Phone Number"
                    required
                    value={formik.values.contactNo}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      formik.setFieldValue("contactNo", numericValue);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="03XX XXXXXXX"
                    icon={Phone}
                    maxLength={11}
                    inputMode="tel"
                    error={
                      formik.touched.contactNo && formik.errors.contactNo
                        ? formik.errors.contactNo
                        : undefined
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <CustomInput
                    type="email"
                    name="contactEmail"
                    label="Email Address"
                    value={formik.values.contactEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="name@example.com"
                    icon={Mail}
                    inputMode="email"
                    error={
                      formik.touched.contactEmail && formik.errors.contactEmail
                        ? formik.errors.contactEmail
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <CustomInput
                  label="City"
                  required
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Lahore"
                  icon={MapPin}
                  error={
                    formik.touched.city && formik.errors.city
                      ? formik.errors.city
                      : undefined
                  }
                />
              </div>

              {/* Address */}
              <div className="">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={detect}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-600 hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {locating ? (
                      <LoadingSpinner
                        content="Detecting..."
                        width="w-auto"
                        iconColor="text-accent"
                        textColor="text-gray-600"
                      />
                    ) : (
                      <>
                        <Navigation size={12} />
                        Detect Location
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  name="contactAddress"
                  required
                  value={formik.values.contactAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="House No, Street, Area..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                />
                {locError && (
                  <div
                    className={`flex items-start gap-2.5 p-3 rounded-lg mt-1 ${
                      errorType === "position_unavailable" ||
                      errorType === "permission_denied"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <Navigation
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        errorType === "position_unavailable" ||
                        errorType === "permission_denied"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-xs font-medium ${
                          errorType === "position_unavailable" ||
                          errorType === "permission_denied"
                            ? "text-amber-700"
                            : "text-red-700"
                        }`}
                      >
                        {locError}
                      </p>
                      {(errorType === "position_unavailable" ||
                        errorType === "permission_denied") && (
                        <button
                          type="button"
                          onClick={detect}
                          className="mt-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 underline transition-colors"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {location && !locError && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Location detected successfully.
                  </p>
                )}
                {formik.touched.contactAddress &&
                  formik.errors.contactAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.contactAddress}
                    </p>
                  )}
              </div>

              <div className="flex justify-end items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    if (addresses.length > 0 && !selectedAddress) {
                      // Stay in changing mode
                    } else if (selectedAddress) {
                      setIsChangingAddress(false);
                    }
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={async () => {
                    const saved = await onSaveAddress();
                    if (saved === false) {
                      errorVibrate();
                    } else {
                      setIsAddingNew(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-accent text-white rounded-full font-bold text-xs shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95"
                >
                  Save & Use Address
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyDeliveryAddress
          key="empty-state"
          setIsChangingAddress={setIsChangingAddress}
        />
      )}

      {/* Remarks Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <CustomInput
          label="Order Notes (Optional)"
          name="saleRemarks"
          type="textarea"
          value={formik.values.saleRemarks}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Special instructions for delivery..."
          rows={3}
          inputClassName="resize-none"
        />
      </div>
    </div>
  );
};

export default DeliveryInfo;
