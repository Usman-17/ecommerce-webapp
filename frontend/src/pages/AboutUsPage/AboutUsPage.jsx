import QuickLinks from "../../components/QuickLinks";
import StillHaveQuestions from "../../components/StillHaveQuestions";

import Help from "./components/Help";
import OurStory from "./components/OurStory";
import AboutHero from "./components/AboutHero";
import Testimonials from "./components/Testimonials";
import AboutFeatures from "./components/Aboutfeatures";
import TrustedPartners from "./components/TrustedPartners";
import QualitySecurity from "./components/QualitySecurity";
import SEO from "../../components/SEO";
// Imports End-----

const AboutUsPage = () => {
  return (
    <div className="py-0 pb-3 md:py-3 lg:px-[4vw]">
      <SEO
        title="About Us"
        description="Learn about Jemzy - your trusted destination for premium jewelry, makeup & beauty products, and hair accessories. Discover our story and commitment to quality."
        keywords="about jemzy, jewelry store, beauty store Pakistan, about us"
        url="/about-us"
      />
      <div className="flex flex-col lg:flex-row sm:gap-8">
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="About Us" />
          <StillHaveQuestions />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <AboutHero />
          <div className="sm:mt-4">
            <AboutFeatures />
          </div>
        </main>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-0 sm:space-y-4">
        <OurStory />

        {/* <ImpactStats /> */}

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3">
          <TrustedPartners />
          <QualitySecurity />
        </div>

        <Testimonials />
        <Help />
      </div>
    </div>
  );
};

export default AboutUsPage;
