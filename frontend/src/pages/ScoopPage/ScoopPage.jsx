import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from "react";

import { errorVibrate, successVibrate } from "../../utils/vibrate";

import { useGetAllProducts } from "../../hooks/useGetAllProducts";

import { SCOOP_CONFIG, getRandomProducts } from "../ScoopPage/scoopData";

import SEO from "../../components/SEO";
import ScoopHero from "./components/ScoopHero";
import HowItWorks from "./components/HowItWorks";
import ScoopSizeSelector from "./components/ScoopSizeSelector";
import ScoopAnimation from "./components/ScoopAnimation";
import ScoopResults from "./components/ScoopResults";
import ScoopSummary from "./components/ScoopSummary";
import ProductQuickView from "./components/ProductQuickView";
import ScoopProductSlider from "./components/ScoopProductSlider";

import bannerImg from "../../assets/scoop/banner.webp";
import bannerImgMobile from "../../assets/scoop/banner-m.webp";
// Imports End----

const ScoopPage = () => {
  const navigate = useNavigate();
  const { products: allProducts, productIsLoading } = useGetAllProducts();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [scoopProducts, setScoopProducts] = useState([]);
  const [selections, setSelections] = useState({});
  const [isScooping, setIsScooping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shakeSizeSelector, setShakeSizeSelector] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const lastToastTimeRef = useRef(0);

  const resultsRef = useRef(null);

  const handleSelectSize = useCallback(
    (sizeId) => {
      if (sizeId !== selectedSize) {
        setSelectedQuantity(1);
      }
      lastToastTimeRef.current = 0;
      setSelectedSize(sizeId);
      setScoopProducts([]);
      setSelections({});
      setShowResults(false);
    },
    [selectedSize],
  );

  const handleSelectQuantity = useCallback((quantity) => {
    setSelectedQuantity(quantity);
    setScoopProducts([]);
    setSelections({});
    setShowResults(false);
  }, []);

  const handleStartScooping = useCallback(() => {
    if (!selectedSize) {
      const now = Date.now();
      if (now - lastToastTimeRef.current > 2000) {
        toast.dismiss();
        toast.error("Please select a scoop size first", {
          id: "scoop-size-required",
          duration: 2000,
        });
        lastToastTimeRef.current = now;
      }
      setShakeSizeSelector(true);
      setTimeout(() => setShakeSizeSelector(false), 600);
      errorVibrate();
      return;
    }

    if (!allProducts || allProducts.length === 0) {
      toast.error("Products not loaded yet. Please try again.");
      return;
    }

    const config = SCOOP_CONFIG[selectedSize];
    const allProductsList = [];

    for (let i = 0; i < selectedQuantity; i++) {
      const count =
        Math.floor(Math.random() * (config.maxItems - config.minItems + 1)) +
        config.minItems;
      const products = getRandomProducts(allProducts, count);
      allProductsList.push(...products);
    }

    setIsScooping(true);
    successVibrate();

    const productsWithIds = allProductsList.map((p, index) => ({
      ...p,
      _instanceId: `${p._id}-${index}`,
    }));
    setScoopProducts(productsWithIds);

    // Auto-select single-option variant groups
    const autoSelections = {};
    productsWithIds.forEach((p) => {
      const options = p.productOptionResponses || [];
      options
        .filter((opt) => opt.productOptionDetailResponses?.length === 1)
        .forEach((opt) => {
          const singleDetail = opt.productOptionDetailResponses[0];
          autoSelections[`${p._instanceId}-${opt.productOptionTypeName}`] =
            singleDetail.productOptionDetailId;
        });
    });
    setSelections(autoSelections);
  }, [selectedSize, selectedQuantity, allProducts]);

  const handleVariantSelect = useCallback(
    (instanceId, optionTypeName, detailId) => {
      setSelections((prev) => ({
        ...prev,
        [`${instanceId}-${optionTypeName}`]: detailId,
      }));
    },
    [],
  );

  const handleAnimationComplete = useCallback(() => {
    setIsScooping(false);
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleBuyNow = useCallback(() => {
    const config = SCOOP_CONFIG[selectedSize];
    const totalAmount =
      config?.pricing?.[selectedQuantity] || config?.price || 0;

    navigate("/place-order", {
      state: {
        scoopProducts,
        selections,
        totalAmount,
        scoopType: config?.name,
        quantity: selectedQuantity,
      },
    });
  }, [navigate, selectedSize, selectedQuantity, scoopProducts, selections]);

  const handleScrollToSizes = () => {
    document
      .getElementById("scoop-sizes")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  return (
    <div className="pb-4 lg:pb-8">
      <SEO
        title="Build Your Scoop | Jemzy"
        description="Choose a scoop size, unwrap surprise products, pick your favorites, and make them yours. Premium jewelry, makeup, and hair accessories."
        keywords="scoop, surprise box, mystery box, jewelry, makeup, hair accessories"
        url="/scoop"
      />

      <div className="sm:px-[4vw] lg:px-[5vw] pt-1 sm:pt-6">
        <ScoopHero onStart={handleScrollToSizes} />

        <HowItWorks />

        <ScoopProductSlider
          products={allProducts}
          isLoading={productIsLoading}
        />

        <div id="scoop-sizes">
          <ScoopSizeSelector
            selectedSize={selectedSize}
            onSelectSize={handleSelectSize}
            selectedQuantity={selectedQuantity}
            onSelectQuantity={handleSelectQuantity}
            shakeSizeSelector={shakeSizeSelector}
          />
        </div>

        {!showResults && (
          <div className="text-center pb-6">
            <button
              type="button"
              onClick={handleStartScooping}
              disabled={isScooping || productIsLoading}
              className="group inline-flex items-center gap-2 bg-accent text-white px-12 py-4 rounded-full font-bold text-base transition-all duration-200 hover:bg-accent/90 active:scale-[0.97] shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isScooping ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Scooping...
                </>
              ) : productIsLoading ? (
                "Loading products..."
              ) : (
                <>&#10024; Scoop Now</>
              )}
            </button>
          </div>
        )}

        <div className="mt-8 sm:mt-10  px-2 sm:px-4">
          <img
            src={bannerImgMobile}
            alt="Scoop Banner"
            className="w-full rounded-2xl object-cover sm:hidden"
          />
          <img
            src={bannerImg}
            alt="Scoop Banner"
            className="hidden w-full rounded-2xl object-cover sm:block"
          />
        </div>

        <ScoopAnimation
          isActive={isScooping}
          onComplete={handleAnimationComplete}
        />

        {showResults && scoopProducts.length > 0 && (
          <div ref={resultsRef}>
            <ScoopResults
              products={scoopProducts}
              selections={selections}
              onVariantSelect={handleVariantSelect}
              onQuickViewOpen={handleOpenQuickView}
            />

            <div className="max-w-md ml-auto mt-6">
              <ScoopSummary
                selectedSize={selectedSize}
                selectedQuantity={selectedQuantity}
                scoopProducts={scoopProducts}
                selections={selections}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        )}

        {showResults && scoopProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              No products available. Try again.
            </p>
          </div>
        )}

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={handleCloseQuickView}
          selections={selections}
          onVariantSelect={handleVariantSelect}
        />
      </div>
    </div>
  );
};

export default ScoopPage;
