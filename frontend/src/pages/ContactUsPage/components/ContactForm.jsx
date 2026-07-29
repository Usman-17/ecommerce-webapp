import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { FileText, Mail, PencilLine, Phone, UserRound } from "lucide-react";

import FormFooter from "./FormFooter";

import CustomInput from "../../../components/CustomInput";

import { errorVibrate, successVibrate } from "../../../utils/vibrate";
// Imports End-----

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Phone number is required";
    } else if (!/^[0-9]{11,}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid phone number (at least 11 digits)";
    }
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.comment) newErrors.comment = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const { mutate: addEnquiry, isPending } = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch("/api/enquiry/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to send message");
      }

      return res.json();
    },
    onSuccess: () => {
      successVibrate();
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        comment: "",
      });
    },
    onError: () => {
      errorVibrate();
      toast.error("Failed to send message!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addEnquiry(formData);
    } else {
      errorVibrate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <CustomInput
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full Name"
          required
          icon={UserRound}
          error={errors.name}
        />

        <CustomInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          required
          icon={Mail}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <CustomInput
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="03xx xxxxxxx"
          required
          icon={Phone}
          error={errors.mobile}
        />

        <CustomInput
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="How can we help?"
          required
          icon={FileText}
          error={errors.subject}
        />
      </div>

      <CustomInput
        label="Message"
        name="comment"
        type="textarea"
        value={formData.comment}
        onChange={handleInputChange}
        required
        placeholder="Write your message here..."
        isTextArea
        icon={PencilLine}
        rows={4}
        error={errors.comment}
      />

      <FormFooter isPending={isPending} />
    </form>
  );
};

export default ContactForm;
