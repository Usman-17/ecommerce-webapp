import { User, Phone, MapPin } from "lucide-react";

import CustomInput from "../../../components/CustomInput";

const PickupContactInfo = ({ formik }) => {
  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 space-y-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
          Contact Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <CustomInput
          label="Full Name"
          name="userName"
          placeholder="Who will pick up?"
          icon={User}
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.userName && formik.errors.userName}
        />

        {/* Phone */}
        <CustomInput
          label="Phone Number"
          name="contactNo"
          placeholder="03xxxxxxxxx"
          icon={Phone}
          value={formik.values.contactNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.contactNo && formik.errors.contactNo}
        />

        {/* City */}
        <div className="sm:col-span-2">
          <CustomInput
            label="Your City"
            name="city"
            placeholder="e.g. Lahore"
            icon={MapPin}
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && formik.errors.city}
          />
        </div>
      </div>
    </div>
  );
};

export default PickupContactInfo;
