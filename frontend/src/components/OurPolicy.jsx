import exchange from "../assets/exchange.webp";
import verified from "../assets/verified.webp";
import support from "../assets/support.webp";

const OurPolicy = () => {
  return (
    <div className="flex flex-row justify-around gap-5 sm:gap-2 text-center py-16 sm:py-20 lg:px-20 text-xs sm:text-sm md:text-bas text-gray-700">
      <div className="hidden sm:block">
        <img
          src={exchange}
          alt="exchange"
          className="w-12 m-auto mb-5 transition-transform duration-150 hover:scale-x-[-1]"
        />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-600">We offer hassle free exchange policy</p>
      </div>

      <div>
        <img
          src={verified}
          alt="verified"
          className="w-12 m-auto mb-5 transition-transform duration-150 hover:scale-x-[-1]"
        />
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="text-gray-600">We provide 7 days free return policy</p>
      </div>

      <div>
        <img
          src={support}
          alt="support"
          className="w-12 m-auto mb-5 transition-transform duration-150 hover:scale-x-[-1]"
        />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-600">We provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
