import { motion as Motion } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  Shield,
  AlertTriangle,
  Scale,
} from "lucide-react";

const sections = [
  {
    icon: ShoppingBag,
    title: "Orders & Products",
    content:
      "All orders are subject to product availability and order verification. Jemzy reserves the right to cancel, refuse, or limit any order at its sole discretion. Product images are for illustrative purposes only and actual products may vary slightly.",
  },
  {
    icon: CreditCard,
    title: "Pricing & Payment",
    content:
      "All prices are displayed in Pakistani Rupees (PKR). Prices and promotions may change without prior notice. Payment must be completed before order processing unless Cash on Delivery (COD) is selected.",
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    content:
      "Estimated delivery times are provided for reference only and may vary depending on location, courier services, and unforeseen circumstances. Jemzy is not responsible for delays caused by third-party logistics providers.",
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    content:
      "Items may be returned within 7 days of delivery if they are unused, unworn, and in their original packaging. Customized, damaged by customer, or clearance items are not eligible for return. Refunds will be processed according to our Refund Policy.",
  },
  {
    icon: User,
    title: "User Accounts",
    content:
      "Customers are responsible for maintaining the confidentiality of their account credentials. Jemzy is not liable for any unauthorized access resulting from failure to secure your account information.",
  },
  {
    icon: Shield,
    title: "Intellectual Property",
    content:
      "All logos, trademarks, images, and content displayed on this website are the exclusive property of Jemzy. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content:
      "Jemzy shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website, products, or services. Our total liability shall not exceed the amount paid for the applicable order.",
  },
  {
    icon: Scale,
    title: "Governing Law",
    content:
      "These Terms & Conditions shall be governed by and interpreted in accordance with the laws of Pakistan. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Pakistan.",
  },
];

const TermsContent = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sections.map((section, index) => (
        <Motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative"
        >
          <div className="absolute top-4 right-4 w-10 h-10 bg-[#CC0D39]/8 rounded-full flex items-center justify-center">
            <span className="text-[11px] font-black text-[#CC0D39]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#CC0D39]/8 rounded-2xl flex items-center justify-center shrink-0">
              <section.icon size={20} className="text-[#CC0D39]" />
            </div>
            <div>
              <h3 className="text-[14px] font-black text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-[12px] text-gray-500 font-bold leading-relaxed pr-10">
                {section.content}
              </p>
            </div>
          </div>
        </Motion.div>
      ))}
    </div>
  );
};

export default TermsContent;
