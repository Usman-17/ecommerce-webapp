import LottieComponent from "lottie-react";
import emptyCartAnimation from "../../../assets/lottie/EmptyBox.json";

import CustomButton from "../../../components/CustomButton";
// Imports End-----

const Lottie = LottieComponent?.default || LottieComponent;

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 text-center min-h-[60vh] p-12">
      <div className="mb-6 w-48 h-48">
        <Lottie animationData={emptyCartAnimation} loop={false} />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>

      <p className="text-gray-500 mb-4 max-w-xs sm:max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
        Get your favorite products in one place with just a few clicks.
      </p>

      <CustomButton to="/shop" text="Start Shopping" />
    </div>
  );
};

export default EmptyCart;
