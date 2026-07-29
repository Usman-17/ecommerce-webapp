import NeedHelp from "../../components/NeedHelp";
import QuickLinks from "../../components/QuickLinks";
import SupportCTA from "../../components/SupportCTA";

import PrivacyHeader from "./components/PrivacyHeader";
import PrivacyContent from "./components/PrivacyContent";
import SEO from "../../components/SEO";

import privacyPolicyBanner from "../../assets/privacy-policy/privacy-policy.webp";
// Imports End-----

const PrivacyPolicyPage = () => {
  return (
    <div className="sm:py-3 lg:px-[4vw]">
      <SEO
        title="Privacy Policy"
        description="Read Jemzy's privacy policy. Learn how we collect, use, and protect your personal information when you shop for jewelry, makeup, and hair accessories."
        keywords="privacy policy, data protection, personal information, jemzy privacy"
        url="/privacy-policy"
      />
      <div className="flex flex-col sm:flex-row sm:gap-8">
        {/* Left Sidebar */}
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Privacy Policy" />
          <NeedHelp />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-4 sm:space-y-8 pb-6">
          {/* Banner */}
          <div className="hidden sm:block">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={privacyPolicyBanner}
                alt="Privacy Policy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <PrivacyHeader />
          <PrivacyContent />
          <SupportCTA />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
