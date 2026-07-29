import { useState } from "react";

import QuickLinks from "../../components/QuickLinks";
import StillHaveQuestions from "../../components/StillHaveQuestions";

import { faqData } from "./faqData";
import FAQHero from "./components/FAQHero";
import FAQItem from "./components/FAQItem";
import SEO from "../../components/SEO";
// Imports End-----

const FAQsPage = () => {
  const [openItems, setOpenItems] = useState({ 0: 0 });

  const toggle = (catIdx, itemIdx) => {
    setOpenItems((prev) => ({
      ...prev,
      [catIdx]: prev[catIdx] === itemIdx ? null : itemIdx,
    }));
  };

  const flatFaqs = faqData.flatMap((group) => group.items);

  return (
    <div className="sm:py-3 lg:px-[4vw]">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to frequently asked questions about Jemzy's jewelry, makeup & beauty products, and hair accessories. Get help with orders, shipping, returns, and more."
        keywords="FAQ, frequently asked questions, jewelry help, makeup orders, shipping FAQ"
        url="/faqs"
        faq={flatFaqs}
      />
      <div className="flex flex-col sm:flex-row sm:gap-8">
        {/* Left Sidebar */}
        <div className="lg:space-y-6">
          <QuickLinks activeLabel="Returns & FAQs" />
          <StillHaveQuestions />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-8 pb-10">
          <FAQHero />

          {faqData.map((group, catIdx) => (
            <div key={catIdx}>
              {/* Category Label */}
              <h3 className="text-base font-bold text-gray-800 mb-3 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block bg-red-500" />
                {group.category}
              </h3>

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {group.items.map((faq, itemIdx) => (
                  <FAQItem
                    key={itemIdx}
                    faq={faq}
                    isOpen={openItems[catIdx] === itemIdx}
                    isLast={itemIdx === group.items.length - 1}
                    onToggle={() => toggle(catIdx, itemIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
