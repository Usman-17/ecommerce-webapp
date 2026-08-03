import NeedHelp from "../../components/NeedHelp";
import QuickLinks from "../../components/QuickLinks";
import SupportCTA from "../../components/SupportCTA";

import TermsHeader from "./components/TermsHeader";
import TermsContent from "./components/TermsContent";
import SEO from "../../components/SEO";
// Imports End-----

const TermsPage = () => {
  return (
    <div className="sm:py-3 lg:px-[4vw]">
      <SEO
        title="Terms & Conditions"
        description="Read Jemzy's terms and conditions. Understand the rules and guidelines for using our website and purchasing jewelry, makeup, and hair accessories."
        keywords="terms and conditions, terms of service, user agreement, jemzy terms"
        url="/terms"
      />
      <div className="flex flex-col sm:flex-row sm:gap-8">
        {/* Left Sidebar */}
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Terms & Conditions" />
          <NeedHelp />
        </div>

        {/* Right Content */}
        <div className="flex-1 pb-6">
          <TermsHeader />

          <TermsContent />
          <SupportCTA />
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
