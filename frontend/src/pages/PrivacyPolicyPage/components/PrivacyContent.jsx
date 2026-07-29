import { motion as Motion } from "framer-motion";
import { User, FileText, Users, Shield, Cookie, UserCheck } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Information We Collect",
    content:
      "We collect personal information that you provide to us, such as your name, email address, phone number, shipping address, and payment information.",
  },
  {
    icon: FileText,
    title: "How We Use Your Information",
    content:
      "We use your information to process orders, deliver products, provide customer support, and improve our services.",
  },
  {
    icon: Users,
    title: "Information Sharing",
    content:
      "We do not sell or rent your personal information. We only share your data with trusted service providers who help us operate our business.",
  },
  {
    icon: Shield,
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    content:
      "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information. You can contact us anytime for assistance.",
  },
];

const PrivacyContent = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sections.map((section, index) => (
        <Motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#CC0D39]/8 rounded-2xl flex items-center justify-center shrink-0">
              <section.icon size={20} className="text-[#CC0D39]" />
            </div>
            <div>
              <h3 className="text-[14px] font-black text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-[12px] text-gray-500 font-bold leading-relaxed">
                {section.content}
              </p>
            </div>
          </div>
        </Motion.div>
      ))}
    </div>
  );
};

export default PrivacyContent;
