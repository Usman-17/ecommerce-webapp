import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import model from "../assets/model.webp";
import banner_s_1 from "../assets/banner_s_1.png";
import banner_s_2 from "../assets/banner_s_2.png";
import banner_s_3 from "../assets/banner_s_3.png";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-32 justify-between max-w-[920px] m-auto pt-5 pb-10 overflow-hidden">
      {/* Content Side */}

      <div className="px-10 md:max-w-full lg:max-w-[446px]">
        <h1 className="text-black text-[38px] md:text-[80px] lg:text-[60px] font-semibold leading-[1.1]">
          Stunning
          <br />
          <span className="inline-flex items-center gap-2 text-red-600">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="68"
              viewBox="0 0 68 68"
              fill="none"
            >
              <path
                d="M34 0L43.6167 24.3833L68 34L43.6167 43.6167L34 68L24.3833 43.6167L0 34L24.3833 24.3833L34 0Z"
                fill="#CC0D39"
              ></path>
            </svg>
            <span>Jewelry</span>
            <br />
          </span>{" "}
          <span>Shine Bright</span>
        </h1>

        <p className="text-[14px] sm:text-lg mt-1 md:mt-5 lg:mt-0  mb-2 lg:mb-6 text-gray-700 leading-relaxed text-nowrap">
          Your new favorite jewelry is just a click away.
          <br />
          <span className="text-[#cc0d39] font-medium">Free shipping</span> on
          all orders — always.
        </p>

        <div>
          <Link
            to="/collection"
            className="relative inline-flex items-center gap-2 px-8 py-2 border-2 border-red-600 text-white bg-red-600 rounded-lg overflow-hidden group transition-all duration-300"
          >
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />

            <span className="relative z-10 flex items-center gap-2 transition-colors duration-200 group-hover:text-red-600">
              Shop Now
              <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
            </span>
          </Link>
        </div>
      </div>

      {/*  ----Image Side----  */}
      <div className="relative">
        <div className="w-full">
          <div className="relative">
            {/* Shapes */}
            <div className="absolute bottom-[-0.1%] lg:bottom-[0%] right-[-0%] w-[50%] h-[35%] border border-[#DFDFDF] rounded-br-[50px] -z-10"></div>
            {/* Main Image */}
            <div className="w-full max-w-[600px] h-[400px] md:h-auto lg:max-w-[600px]">
              <img
                src={model}
                alt="Jewelry Model"
                className="w-full h-full sm:h-auto object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                  e.currentTarget.style.objectFit = "contain";
                }}
              />
            </div>

            {/* Stars */}
            <ul className="absolute top-5 left-0 lg:-left-5 flex gap-2">
              {[1, 2, 3].map((star) => (
                <li key={star}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="57"
                    height="57"
                    viewBox="0 0 57 57"
                    fill="none"
                  >
                    <path
                      d="M28.5 0L33.3366 23.6634L57 28.5L33.3366 33.3366L28.5 57L23.6634 33.3366L0 28.5L23.6634 23.6634L28.5 0Z"
                      fill="#cc0d391a"
                    ></path>
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* banner-small-images-box */}
        <div className="absolute -left-2 sm:-left-10 bottom-[1%] sm:bottom-[0%] w-[200px] p-2 sm:p-4 bg-white/70 backdrop-blur-md shadow-2xl rounded-xl z-20 flex items-center justify-center">
          {/* Heart Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.7351 0.811523C19.9976 0.811523 17.0258 2.21087 15.5556 5.0098C14.0854 2.21087 11.1135 0.811523 8.37604 0.811523C3.5866 0.811523 0 4.2495 0 10.0174C0 12.5052 0.872361 15.7363 2.84187 18.4185C4.81125 21.1009 5.98278 22.5293 9.79694 25.4156C13.6111 28.3021 15.5556 28.8 15.5556 28.8C15.5556 28.8 17.5 28.3021 21.3142 25.4156C25.1283 22.5293 26.2999 21.1009 28.2692 18.4185C30.2388 15.7363 31.1111 12.5052 31.1111 10.0174C31.1111 4.2495 27.5245 0.811523 22.7351 0.811523Z"
              fill="#CC0D39"
            />
          </svg>

          {/* Customer Images */}
          <ul className="flex -space-x-2">
            <li className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={banner_s_1}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </li>
            <li className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={banner_s_2}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </li>
            <li className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={banner_s_3}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hero;
