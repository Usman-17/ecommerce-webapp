import { Link } from "react-router-dom";
import InViewAnimation from "./InViewAnimation";
import logo from "../assets/logo.webp";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-8 sm:gap-14 my-5 sm:my-10  text-sm">
        <InViewAnimation delay={0}>
          <div>
            <img src={logo} alt="jemzy.pk" className="w-24 h-12" />

            <p className="w-full md:w-2/3 text-gray-600 mt-2">
              Welcome to <span className="font-semibold text-black">JEMZY</span>
              , your trusted destination for elegant and affordable jewelry.
              From delicate everyday pieces to eye-catching designs, our
              collection is made to help you shine with confidence. Discover
              jewelry that tells your story — beautifully and effortlessly.
            </p>
          </div>
        </InViewAnimation>

        <InViewAnimation delay={0.1}>
          <div>
            <p className="uppercase text-xl font-medium mb-5">Company</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <Link to="/">
                <li className="hover:text-black transition-colors duration-300">
                  Home
                </li>
              </Link>

              <Link to="/order">
                <li className="hover:text-black transition-colors duration-300">
                  Delivery
                </li>
              </Link>

              <Link to="about">
                <li className="hover:text-black transition-colors duration-300">
                  About Us
                </li>
              </Link>

              <Link to="/contact">
                <li className="hover:text-black transition-colors duration-300">
                  Contact Us
                </li>
              </Link>
            </ul>
          </div>
        </InViewAnimation>

        <InViewAnimation delay={0.2}>
          <div>
            <p className="uppercase text-xl font-medium mb-5">Get in Touch</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-black transition-colors duration-300">
                <a href="tel:+923274243417">0327 4243417</a>
              </li>

              <li className="hover:text-black transition-colors duration-300">
                <a href="mailto:contact.jemzypk@gmail.com">
                  contact.jemzypk@gmail.com
                </a>
              </li>

              <Link to="">
                <li className="hover:text-black transition-colors duration-300">
                  INSTAGRAM
                </li>
              </Link>

              <Link to="">
                <li className="hover:text-black transition-colors duration-300">
                  FACEBOOK
                </li>
              </Link>
            </ul>
          </div>
        </InViewAnimation>
      </div>

      <div>
        <hr />
        <p className="py-3 sm:py-5 text-[11px] sm:text-sm text-center mb-14 sm:mb-0">
          Copyright {currentYear} @usman.dev - All Right Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
