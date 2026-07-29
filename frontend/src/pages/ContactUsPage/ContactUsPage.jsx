import ContactBar from "./components/ContactBar";
import ContactForm from "./components/ContactForm";

import QuickLinks from "../../components/QuickLinks";

import StillHaveQuestions from "../../components/StillHaveQuestions";
import SEO from "../../components/SEO";
// Imports End----

const ContactUsPage = () => {
  return (
    <div className="sm:py-3 lg:px-[4vw]">
      <SEO
        title="Contact Us"
        description="Get in touch with Jemzy. Contact us for order inquiries, returns, and customer support. We're here to help with jewelry, makeup, and hair accessories."
        keywords="contact jemzy, customer support, order help, return policy"
        url="/contact-us"
      />

      <div className="flex flex-col sm:flex-row sm:gap-8">
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Contact Us" />

          <StillHaveQuestions />
        </div>

        {/* Right Column: Contact Form */}
        <div className="flex-1">
          <div className="bg-white p-5 sm:p-10 rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            <div className="w-12 h-1 bg-accent/80 rounded-full"></div>

            <p className="text-gray-500 text-sm mb-4 sm:mb-8 font-medium max-w-92.5 mt-2">
              Have a question or feedback? We&apos;d love to hear from you. Fill
              out the form below and we&apos;ll get back to you shortly.
            </p>

            <ContactForm />
          </div>
        </div>
      </div>

      <div className="my-4">
        <ContactBar />
      </div>
    </div>
  );
};

export default ContactUsPage;
