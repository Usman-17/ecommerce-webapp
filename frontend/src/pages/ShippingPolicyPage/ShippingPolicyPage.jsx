import NeedHelp from "../../components/NeedHelp";
import QuickLinks from "../../components/QuickLinks";
import SupportCTA from "../../components/SupportCTA";

import shippingBanner from "../../assets/shipping-policy/shipping-policy.webp";
import shippingBannerMobile from "../../assets/shipping-policy/shipping-mobile.webp";

import ThankYouBanner from "./components/ThankYouBanner";
import ShippingFeatures from "./components/ShippingFeatures";
import DeliveryInformation from "./components/DeliveryInformation";
import SEO from "../../components/SEO";
// Imports End-----

const ShippingPolicyPage = () => {
  return (
    <div className="sm:py-3 lg:px-[4vw]">
      <SEO
        title="Shipping Policy"
        description="Learn about Jemzy's shipping options, delivery times, and rates. We deliver jewelry, makeup, and hair accessories across Pakistan with fast and reliable shipping."
        keywords="shipping policy, delivery, shipping rates, fast delivery Pakistan"
        url="/shipping-policy"
      />
      <div className="flex flex-col sm:flex-row sm:gap-8">
        {/* Left Sidebar */}
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Shipping Policy" />
          <NeedHelp />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-4 sm:space-y-8 pb-6">
          {/* Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gray-100 min-h-62.5 sm:min-h-105">
            <img
              src={shippingBannerMobile}
              alt="Shipping Policy"
              className="w-full h-full object-contain block md:hidden"
              loading="lazy"
            />
            <img
              src={shippingBanner}
              alt="Shipping Policy"
              className="w-full h-full object-contain hidden md:block"
              loading="lazy"
            />
          </div>

          <ShippingFeatures />
          <DeliveryInformation />
          <ThankYouBanner />
          <SupportCTA />
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
