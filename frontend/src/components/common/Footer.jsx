import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

import InViewAnimation from "../InViewAnimation";

import paymentImg from "../../assets/payment.png";
import logo from "../../assets/logo.webp";

import { useGetAllProductAreas } from "../../hooks/useGetAllProductAreas";
import { SOCIAL_LINKS, CONTACT_INFO } from "../../constants/social";
// Imports End-------

const Footer = () => {
  const { areas = [] } = useGetAllProductAreas();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden sm:block bg-linear-to-b from-[#fdf6ef] to-[#fffaf5] border-t border-[#efe3d4] text-gray-800 pt-8 sm:pt-16 relative z-10">
      <div className="max-w-8xl mx-auto sm:px-[5vw] pb-4 sm:pb-2">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[380px_1fr_1fr_1fr_1fr] gap-y-12 gap-x-8 pb-6 sm:pb-16">
          {/* Brand Info */}
          <InViewAnimation delay={0.1}>
            <div className="flex flex-col gap-6">
              <Link to="/">
                <img
                  src={logo}
                  alt="Jemzy logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>

              <div className="text-gray-500 text-[14px] leading-relaxed font-medium pr-8">
                <b>JEMZY</b> offers a beautiful range of artificial jewelry and
                fashion accessories, combining trendy designs, quality
                craftsmanship, and affordable prices for every style and
                occasion.
              </div>

              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${link.name}`}
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 group/social active:scale-95 border border-gray-300 rounded-full hover:border-[#CC0D39] hover:bg-[#CC0D39]/5"
                  >
                    <img
                      src={link.icon}
                      alt=""
                      aria-hidden="true"
                      className="w-4 h-4 object-contain transition-all duration-300 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
            </div>
          </InViewAnimation>

          {/* Quick Nav Columns */}
          <InViewAnimation delay={0.2}>
            <div className="flex flex-col gap-6">
              <h2 className="text-[14px] font-extrabold uppercase tracking-[2px] text-gray-900 sm:border-b sm:border-gray-100 pb-2 sm:pb-4">
                Information
              </h2>

              <ul className="flex flex-col gap-3.5">
                {[
                  { name: "Shop", path: "/shop" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Contact Us", path: "/contact-us" },
                  { name: "Privacy Policy", path: "/privacy-policy" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-[14px] text-gray-500 hover:text-primary transition-all duration-300 font-medium"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </InViewAnimation>

          <InViewAnimation delay={0.3}>
            <div className="flex flex-col gap-6">
              <h2 className="text-[14px] font-extrabold uppercase tracking-[2px] text-gray-900 sm:border-b sm:border-gray-100 pb-2 sm:pb-4">
                Customer Care
              </h2>

              <ul className="flex flex-col gap-3.5">
                {[
                  { name: "Track Order", path: "/track-order" },
                  { name: "Shipping Policy", path: "/shipping-policy" },
                  { name: "Returns & FAQ", path: "/faqs" },
                  { name: "Contact Us", path: "/contact-us" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-[14px] text-gray-500 hover:text-primary transition-all duration-300 font-medium"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </InViewAnimation>

          <InViewAnimation delay={0.35}>
            <div className="flex flex-col gap-6">
              <h2 className="text-[14px] font-extrabold uppercase tracking-[2px] text-gray-900 sm:border-b sm:border-gray-100 pb-2 sm:pb-4">
                Shop
              </h2>

              <ul className="flex flex-col gap-3.5">
                <li>
                  <Link
                    to="/category"
                    className="text-[14px] text-gray-500 hover:text-primary transition-all duration-300 font-medium"
                  >
                    View All
                  </Link>
                </li>

                {areas.slice(0, 4).map((area) => (
                  <li key={area._id}>
                    <Link
                      to={`/shop?area=${encodeURIComponent(area.name)}`}
                      className="text-[14px] text-gray-500 hover:text-primary transition-all duration-300 font-medium"
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </InViewAnimation>

          <InViewAnimation delay={0.4}>
            <div className="flex flex-col gap-6">
              <h2 className="text-[14px] font-extrabold uppercase tracking-[2px] text-gray-900 sm:border-b sm:border-gray-100 pb-2 sm:pb-4">
                Get In Touch
              </h2>

              <address className="list-none p-0 m-0">
                <ul className="flex flex-row sm:flex-col justify-center sm:justify-start gap-8 sm:gap-4">
                  {/* Location */}
                  <li className="flex items-start gap-3 group">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#CC0D39] text-white">
                      <MapPin size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                        Location
                      </span>
                      <span className="text-[13px] font-semibold text-gray-600">
                        {CONTACT_INFO.location}
                      </span>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-4 group">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#CC0D39] text-white">
                      <Phone size={14} />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                        Support
                      </span>

                      <a
                        href={CONTACT_INFO.phoneLink}
                        className="text-[13px] font-semibold text-gray-600 hover:text-primary transition-colors"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3 group translate-y-0.5">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#CC0D39] text-white">
                      <Mail size={14} />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                        Email
                      </span>

                      <a
                        href={CONTACT_INFO.emailLink}
                        className="text-[13px] font-semibold text-gray-600 hover:text-primary transition-colors truncate"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </li>
                </ul>
              </address>
            </div>
          </InViewAnimation>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-gray-400 capitalize tracking-[1px] text-center md:text-left">
            &copy; {currentYear} <span className="text-gray-900">JEMZY</span>.
            All Rights Reserved.
          </p>
          <img
            src={paymentImg}
            alt="Payment methods"
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
