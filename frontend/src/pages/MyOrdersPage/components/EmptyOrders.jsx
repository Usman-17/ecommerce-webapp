import LottieComponent from "lottie-react";
import emptyCartAnimation from "../../../assets/lottie/EmptyBox.json";

const Lottie = LottieComponent?.default || LottieComponent;

import CustomButton from "../../../components/CustomButton";

const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#fffaf5] rounded-2xl border border-dashed border-gray-200 min-h-[60vh] md:bg-white md:min-h-0 md:flex-1">
      <div className="mb-6 w-48 h-40">
        <Lottie animationData={emptyCartAnimation} loop={false} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 font-outfit text-center">
        No Order Found
      </h2>

      <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm text-center">
        Looks like you haven't placed any orders yet. Start shopping to fill
        this space!
      </p>

      <CustomButton to="/shop" text="Start Shopping" />
    </div>
  );
};

export default EmptyOrders;
