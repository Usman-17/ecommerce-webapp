import { useEffect } from "react";
import CustomButton from "./CustomButton";

import LottieComponent from "lottie-react";
import lonely404 from "../assets/lottie/Lonely404.json";
import { useAnalytics } from "../hooks/useAnalytics";

const Lottie = LottieComponent?.default || LottieComponent;
// Imports End-----

const NotFound = () => {
  const { track404 } = useAnalytics();

  useEffect(() => {
    track404(window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12">
      <div aria-hidden="true" className="w-full max-w-100 mb-4">
        <Lottie animationData={lonely404} loop={false} />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        404 - Product Not Found
      </h1>

      <p className="text-gray-600 mb-8 max-w-md">
        The product you are looking for might have been removed or is
        temporarily unavailable.
      </p>

      <CustomButton to="/" text="Back to Home" />
    </main>
  );
};

export default NotFound;
