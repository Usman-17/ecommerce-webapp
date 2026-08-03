import { RotateCcw } from "lucide-react";

import LottieComponent from "lottie-react";
import locationAnimation from "../../../assets/lottie/location.json";
const Lottie = LottieComponent?.default || LottieComponent;

const EmptyAddress = ({ onAddAddress }) => {
  return (
    <div className="flex min-h-[82vh] bg-white h-full flex-col items-center justify-center py-16 px-4 rounded-lg">
      <div className="w-40 h-40">
        <Lottie animationData={locationAnimation} loop={false} />
      </div>

      <h3 className="text-lg font-bold text-gray-700 mb-2">
        No addresses saved
      </h3>

      <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
        Add your delivery addresses to make checkout faster
      </p>

      <button
        onClick={onAddAddress}
        className="flex items-center gap-2 text-sm px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        <RotateCcw size={16} />
        Add Your First Address
      </button>
    </div>
  );
};

export default EmptyAddress;
