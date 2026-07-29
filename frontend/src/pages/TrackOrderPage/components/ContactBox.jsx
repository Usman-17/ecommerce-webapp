import { Link } from "react-router-dom";
import { Headphones, Mail } from "lucide-react";

const ContactBox = () => {
  return (
    <div className="hidden sm:flex sm:flex-row items-center justify-between gap-6 mt-4 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 ">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
          <Headphones size={28} />
        </div>

        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-1">
            Don't have an account?
          </h4>

          <p className="text-sm text-gray-500 font-medium">
            You can still view your order status without signing in. If you do
            not have your Order Number, please refer to your confirmation email.
            For additional assistance,{" "}
            <Link
              to="/contact-us"
              className="text-[#FF4C5E] font-bold hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <Link
        to="/contact-us"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-accent text-accent font-bold rounded-xl hover:bg-accent hover:text-white transition-all whitespace-nowrap"
      >
        <Mail size={18} />
        Contact Us
      </Link>
    </div>
  );
};

export default ContactBox;
