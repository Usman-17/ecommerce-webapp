import contactUsImage from "../assets/contact.webp";

import { useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";

import CustomLabel from "../components/CustomLabel";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import SectionHeading from "../components/SectionHeading";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    comment: "",
  });

  const {
    mutate: addEnquiry,
    isError,
    error,
    isPending,
  } = useMutation({
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
      toast.error("Failed to send message!");
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEnquiry(formData);
  };
  return (
    <>
      <Helmet>
        <title>Contact Us - Jemzy.pk | Jewelry & Customer Support</title>
        <meta
          name="description"
          content="Have questions or need help? Contact Jemzy.pk for assistance with orders, product inquiries, or customer support. We're here to help!"
        />
        <meta
          name="keywords"
          content="Jemzy.pk contact, jewelry support, customer service, email, phone, help"
        />
        <link rel="canonical" href="https://www.jemzy.pk/contact" />
        <meta
          property="og:title"
          content="Contact Us - Jemzy.pk | Jewelry & Support"
        />
        <meta
          property="og:description"
          content="Reach out to Jemzy.pk for product questions, order support, or general inquiries. We’re just a message away!"
        />
        <meta property="og:url" content="https://www.jemzy.pk/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Section Heading */}
      <div className="text-xl text-center pt-6 sm:pt-8 border-t">
        <SectionHeading text1="CONTACT" text2="US" />
      </div>

      {/* Contact Section */}
      <div className="my-2 flex flex-col lg:flex-row sm:gap-16 px-0 lg:px-6">
        {/* Contact Image */}
        <img
          src={contactUsImage}
          alt="Contact Us"
          className="w-full lg:max-w-[450px] object-cover rounded-md"
        />

        {/* Contact Content */}
        <div className="flex flex-col justify-center gap-4 sm:gap-6 lg:w-2/4 text-gray-600">
          <p>
            Have a question, concern, or simply want to connect with us? Feel
            free to reach out using any of the methods below. Our team is here
            to assist you and provide any information you may need.
          </p>

          <h3 className="text-gray-800 text-lg font-semibold">Get in Touch</h3>
          <p>
            We&apos;re committed to providing exceptional customer service.
            Whether you need help with an order, have inquiries about our
            products, or just want to say hello, don&apos;t hesitate to contact
            us.
          </p>

          {/* Contact Details */}
          <ul className="space-y-1 text-gray-700">
            <li>
              <b>Email:</b>{" "}
              <a
                href="mailto:contact.jemzypk@gmail.com"
                className="hover:text-red-600 ease-in-out duration-200"
              >
                contact.jemzypk@gmail.com
              </a>
            </li>
            <li>
              <b>Phone:</b>{" "}
              <a
                href="tel:+923274243417"
                className="hover:text-red-600 ease-in-out duration-200"
              >
                0327 4243417
              </a>
            </li>
            <li>
              <b>Address:</b> Jemzy.pk, Lahore, Pakistan
            </li>
          </ul>

          <h3 className="text-gray-800 text-lg font-semibold">Follow Us</h3>
          <p>
            Stay connected and follow us on social media for the latest updates,
            promotions, and new arrivals:
          </p>

          <ul className="flex gap-4">
            <li>
              <a
                href=""
                target="_blank"
                className="hover:text-red-600 ease-in-out duration-150"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href=""
                target="_blank"
                className="hover:text-red-600 ease-in-out duration-150"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-3 lg:px-6 py-8 sm:py-16 max-w-10xl mx-auto"
      >
        <h2 className="text-gray-800 text-xl font-semibold">
          Get in Touch with Us
        </h2>
        {/* Name */}
        <div>
          <CustomLabel label="Your Name" />
          <CustomInput
            type="text"
            name="name"
            id="name"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Email and Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <CustomLabel label="Your Email" />
            <CustomInput
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <CustomLabel label="Mobile" />
            <CustomInput
              type="tel"
              name="mobile"
              id="mobile"
              placeholder="0000 0000000"
              required
              aria-required="true"
              minLength={11}
              maxLength={11}
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="mb-5">
          <CustomLabel label="Subject" />
          <CustomInput
            type="text"
            name="subject"
            id="subject"
            required
            placeholder="What is your message about?"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>

        {/* Comment */}
        <div>
          <CustomLabel label="Your Message" />
          <textarea
            name="comment"
            rows="4"
            id="comment"
            required
            placeholder="Type your message here..."
            value={formData.comment}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed bg-[#fffaf5]"
          />
        </div>

        {isError && <div className="text-red-500 text-sm">{error.message}</div>}

        {/* Submit Button */}
        <div className="flex justify-end">
          <CustomButton
            disabled={isPending}
            content={isPending ? "Submitting..." : "Submit"}
            className="w-52"
            type="submit"
          />
        </div>
      </form>
    </>
  );
};

export default ContactPage;
