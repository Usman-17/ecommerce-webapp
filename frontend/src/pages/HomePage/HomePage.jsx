import Hero from "./sections/Hero";
import CategorySection from "./sections/CategorySection";
import JewelrySection from "./sections/JewelrySection";
import MakeupSection from "./sections/MakeupSection";
import HairAccessoriesSection from "./sections/HairAccessoriesSection";
import PromoBanner from "./sections/PromoBanner";
import PriceRangeSection from "./sections/PriceRangeSection";

import PurchasePopup from "./sections/PurchasePopup";

import RecommendedProducts from "../../components/RecommendedProducts";
import SEO from "../../components/SEO";

import { useGetAllProducts } from "../../hooks/useGetAllProducts";
// Imports End-----

const HomePage = () => {
  const { products, allProducts, productIsLoading } = useGetAllProducts();

  return (
    <main>
      <h1 className="sr-only">
        Jemzy - Shop Jewelry, Makeup & Beauty, and Hair Accessories
      </h1>
      <SEO
        title="Jemzy - Jewelry, Makeup & Beauty, Hair Accessories"
        description="Shop premium jewelry, makeup & beauty products, and hair accessories at Jemzy. Trendy necklaces, bracelets, earrings, cosmetics, hair clips & more with fast delivery across Pakistan."
        keywords="jewelry, makeup, beauty, hair accessories, necklaces, bracelets, earrings, cosmetics, online shopping Pakistan"
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Jemzy",
          url: "https://jemzy.pk",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://jemzy.pk/shop?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Hero />
      <CategorySection />
      <JewelrySection />
      <MakeupSection />
      <HairAccessoriesSection />
      <PriceRangeSection />
      <PromoBanner />
      <div className="lg:px-32">
        <RecommendedProducts
          allProducts={allProducts}
          productIsLoading={productIsLoading}
        />
      </div>

      <PurchasePopup products={products} />
    </main>
  );
};

export default HomePage;
