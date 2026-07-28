import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronRight, Star, Share2 } from "lucide-react";

import { apiRequest } from "../../utils/authFetch";

import { useWishlist } from "../../hooks/useWishlist";
import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import useEcommerce from "../../hooks/useEcommerce";

import NotFound from "../../components/NotFound";
import SectionHeading from "../../components/SectionHeading";
import WishlistButton from "../../components/WishlistButton";
import Breadcrumbs from "../../components/common/Breadcrumbs";

import ProductTabs from "./components/ProductTabs";
import ProductPrice from "./components/ProductPrice";
import ProductImages from "./components/ProductImages";
import ProductActions from "./components/ProductActions";
import ProductOptions from "./components/ProductOptions";
import ProductFeatures from "./components/ProductFeatures";
import RelatedProducts from "./components/RelatedProducts";
import ProductSkeleton from "./components/ProductSkeleton";
import MobileActionBar from "./components/MobileActionBar";
import SEO from "../../components/SEO";
// Imports End-----

const ProductPage = () => {
  const { slug } = useParams();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Validate slug exists
  const isValidSlug = useMemo(() => Boolean(slug), [slug]);

  // Fetch product data by slug
   // Get Product Query
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/product/slug/${slug}`);

      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    retry: false,
  });
  // Fetch all products for related products
  const { allProducts } = useGetAllProducts();

  // Fetch product reviews directly
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["productReviews", product?.data?.productId],
    queryFn: async () => {
      const result = await apiRequest(
        `/api/WAP/ProductReview/GetByProductId?Id=${product.data.productId}`,
      );
      return Array.isArray(result?.data) ? result.data : [];
    },
    enabled: !!product?.data?.productId,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Wishlist logic
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Analytics
  const { trackViewItem, trackAddToWishlist, trackRemoveFromWishlist } =
    useEcommerce();

  const isLiked = isInWishlist(product?.data?.productId);

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (!product?.data) return;
    if (isLiked) {
      removeFromWishlist(product.data.productId);
      trackRemoveFromWishlist(product.data);
    } else {
      addToWishlist({
        ...product.data,
        productName: product.data.productName,
        productImageURL: mainImage,
        netSalePrice: currentPrice,
        productSalePrice: originalPrice,
      });
      trackAddToWishlist(product.data);
    }
  };

  // Share product
  const handleShare = async () => {
    const shareData = {
      title: product?.data?.productName,
      text: `Check out ${product?.data?.productName}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare) {
        const imageUrl = product?.data?.productImageURL;
        if (imageUrl) {
          try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], "product.webp", { type: blob.type });
            const shareWithImage = { ...shareData, files: [file] };
            if (navigator.canShare(shareWithImage)) {
              await navigator.share(shareWithImage);
              return;
            }
          } catch {
            // Image fetch failed, share without image
          }
        }
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      // User cancelled or error
    }
  };

  // Selected options (color, size, pack, etc.)
  const [prevProductId, setPrevProductId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [shakeOptions, setShakeOptions] = useState(false);

  // Reset and pre-select options dynamically during render phase when product changes
  if (product?.data && product.data.productId !== prevProductId) {
    setPrevProductId(product.data.productId);

    const initial = {};
    const options = product.data.productOptionResponses || [];
    options.forEach((option) => {
      if (option.productOptionDetailResponses?.length > 0) {
        const typeName = (option.productOptionTypeName || "").toLowerCase();
        const isColor =
          typeName === "color" || option.productOptionPrefix === "CLRPOT";
        if (!isColor) {
          // Don't auto-select size, leave it empty
        }
      }
    });
    setSelectedOptions(initial);
  }

  // Product images
  const images = useMemo(() => {
    const all = [];

    // Add main image first
    if (product?.data?.productImageURL) {
      all.push({ productImageURL: product.data.productImageURL });
    }

    // Add additional images from productImageResponses
    if (product?.data?.productImageResponses?.length > 0) {
      all.push(
        ...product.data.productImageResponses.map((img) => ({
          productImageURL: img.productImageURL,
        })),
      );
    }

    // Filter duplicates and invalid entries
    const unique = [];
    const seen = new Set();

    all.forEach((img) => {
      const url =
        img.productImageURL ||
        img.imageURL ||
        (typeof img === "string" ? img : null);
      if (url && !seen.has(url)) {
        seen.add(url);
        unique.push(img);
      }
    });

    return unique;
  }, [product]);

  const mainImage =
    images[0]?.productImageURL || product?.data?.productImageURL;

  // Get variant image for selected color
  const activeVariantImage = useMemo(() => {
    const colorOption = product?.data?.productOptionResponses?.find(
      (o) =>
        o.productOptionTypeId === 10 ||
        (o.productOptionTypeName || "").toLowerCase() === "color",
    );
    if (!colorOption) return null;

    const selectedColorDetailId = selectedOptions[colorOption.productOptionId];
    if (!selectedColorDetailId) return null;

    // Check if there's a variant image matching the selected color
    const matchedVariant = product?.data?.productVariantResponses?.find(
      (v) =>
        v.isOptionVariant &&
        v.colorProductOptionDetailId === selectedColorDetailId &&
        v.variantImageURL,
    );

    return matchedVariant?.variantImageURL || null;
  }, [product, selectedOptions]);

  const handleSelect = (optionId, detailId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: detailId,
    }));
  };

  // Filter packs based on selected options dynamically using variants
  const filteredPacks = useMemo(() => {
    if (!product?.data?.productPackResponses) return [];

    const variants = product.data.productVariantResponses || [];
    const packs = product.data.productPackResponses;

    // Filter variants based on selected options first!
    let matchingVariants = variants;
    let hasSelectedOptions = false;

    product.data.productOptionResponses?.forEach((option) => {
      const selectedDetailId = selectedOptions[option.productOptionId];
      if (selectedDetailId) {
        hasSelectedOptions = true;
        const typeName = (option.productOptionTypeName || "").toLowerCase();
        const fieldName = `${typeName}ProductOptionDetailId`;
        matchingVariants = matchingVariants.filter(
          (v) => v[fieldName] === selectedDetailId,
        );
      }
    });

    if (hasSelectedOptions && matchingVariants.length > 0) {
      const variantCodes = new Set(
        matchingVariants.map((v) => v.productVariantCode).filter(Boolean),
      );
      const variantIds = new Set(
        matchingVariants.map((v) => v.productVariantId).filter(Boolean),
      );

      const filtered = packs.filter(
        (p) =>
          (p.productVariantId && variantIds.has(p.productVariantId)) ||
          (p.productPackCode && variantCodes.has(p.productPackCode)),
      );
      if (filtered.length > 0) return filtered;
    }

    let directFilteredPacks = packs;
    product.data.productOptionResponses?.forEach((option) => {
      const selectedDetailId = selectedOptions[option.productOptionId];
      if (selectedDetailId) {
        const typeName = (option.productOptionTypeName || "").toLowerCase();
        const fieldName = `${typeName}ProductOptionDetailId`;

        if (fieldName in (packs[0] || {})) {
          directFilteredPacks = directFilteredPacks.filter(
            (p) => p[fieldName] === selectedDetailId,
          );
        }
      }
    });

    return directFilteredPacks;
  }, [product, selectedOptions]);

  const effectivePackId = useMemo(() => {
    const currentPackId = selectedOptions["pack"];
    const isValid = filteredPacks.find(
      (p) => p.productPackId === currentPackId,
    );
    return isValid ? currentPackId : filteredPacks[0]?.productPackId;
  }, [filteredPacks, selectedOptions]);

  // Selected pack details
  const selectedPack = product?.data?.productPackResponses?.find(
    (pack) => pack.productPackId === effectivePackId,
  );

  // Pricing
  const priceInfo =
    selectedPack?.productPriceDetailResponse ||
    product?.data?.productPriceDetailResponse;
  const currentPrice = priceInfo?.netSalePrice ?? priceInfo?.salePrice ?? 0;
  const originalPrice = priceInfo?.salePrice ?? 0;
  const discountPercent = priceInfo?.discountPercent ?? 0;

  // Recently viewed products
  const { addRecentlyViewed } = useRecentlyViewed();

  // Track view_item when product loads
  useEffect(() => {
    if (product?.data) {
      trackViewItem(product.data);
    }
  }, [product?.data, trackViewItem]);

  const recentlyViewedRef = useRef({
    mainImage,
    currentPrice,
    originalPrice,
    product,
  });

  useEffect(() => {
    recentlyViewedRef.current = {
      mainImage,
      currentPrice,
      originalPrice,
      product,
    };
  });

  useEffect(() => {
    const {
      mainImage: img,
      currentPrice: price,
      originalPrice: orig,
      product: p,
    } = recentlyViewedRef.current;
    if (p?.data && img) {
      addRecentlyViewed({
        productId: p.data.productId,
        productName: p.data.productName,
        productSlug: p.data.productSlug,
        productImageURL: img,
        netSalePrice: price,
        productSalePrice: orig,
      });
    }
  }, [product?.data?.productId, addRecentlyViewed]);

  // Calculate related products count
  const relatedProductsCount = useMemo(() => {
    if (
      !allProducts ||
      allProducts.length === 0 ||
      !product?.data?.productId ||
      !product?.data?.productCategoryName
    )
      return 0;

    const currentId = String(product.data.productId);
    const category = product.data.productCategoryName;

    return allProducts.filter((item) => {
      const itemId = String(item.productId);
      const itemWebLinkId = String(item.productWebLinkId);
      const isSameProduct = itemId === currentId || itemWebLinkId === currentId;
      return item.productCategoryName === category && !isSameProduct;
    }).length;
  }, [allProducts, product]);

  if (isLoading) return <ProductSkeleton />;
  if (!isValidSlug || !product || !product.data) return <NotFound />;

  return (
    <>
      <SEO
        title={product.data.productName}
        description={
          product.data.productShortDesc ||
          product.data.productDescription?.replace(/<[^>]+>/g, "").slice(0, 160)
        }
        image={product.data.productImageURL}
        url={`/product/${slug}`}
        type="product"
        breadcrumbs={[
          { name: "Home", url: "/" },
          {
            name: product.data.productAreaName,
            url: `/shop?area=${encodeURIComponent(product.data.productAreaName)}`,
          },
          {
            name: product.data.productCategoryName,
            url: `/shop?area=${encodeURIComponent(product.data.productAreaName)}&category=${encodeURIComponent(product.data.productCategoryName)}`,
          },
          { name: product.data.productName },
        ]}
        product={{
          name: product.data.productName,
          slug,
          description:
            product.data.productShortDesc ||
            product.data.productDescription
              ?.replace(/<[^>]+>/g, "")
              .slice(0, 300),
          images: images
            .map((img) => img.productImageURL || img.imageURL || img)
            .filter(Boolean),
          price:
            product.data.productVariantResponses?.[0]
              ?.productVariantSalePrice || product.data.productSalePrice,
          currency: "PKR",
          inStock: (product.data.productVariantResponses?.length || 0) > 0,
          brand: "Jemzy",
          rating:
            product?.data?.totalReviewCounts > 0
              ? {
                  value: String(product.data.totalReviewRating),
                  count: product.data.totalReviewCounts,
                }
              : undefined,
        }}
      />
      <div className="py-3 sm:px-[4vw]" key={product.data.productId}>
        {/* Desktop Breadcrumb */}
        <div className="hidden sm:block px-2">
          <Breadcrumbs
            items={[
              {
                label: product?.data?.productAreaName,
                path: `/shop?area=${encodeURIComponent(product?.data?.productAreaName)}`,
              },
              {
                label: product?.data?.productCategoryName,
                path: `/shop?area=${encodeURIComponent(product?.data?.productAreaName)}&category=${encodeURIComponent(product?.data?.productCategoryName)}`,
              },
              {
                label: product?.data?.productSubCategoryName,
                path: `/shop?area=${encodeURIComponent(product?.data?.productAreaName)}&category=${encodeURIComponent(product?.data?.productCategoryName)}&subcategory=${encodeURIComponent(product?.data?.productSubCategoryName)}`,
              },
              { label: product?.data?.productName },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10 -mt-2 sm:mt-0">
          {/* Images Section */}
          <div
            className={`${images.length <= 1 ? "lg:col-span-6 xl:col-span-6" : "lg:col-span-6 xl:col-span-6"}`}
          >
            <div className="space-y-12">
              <ProductImages
                images={images}
                activeVariantImage={activeVariantImage}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div
            className={`${images.length <= 1 ? "lg:col-span-6 xl:col-span-6" : "lg:col-span-6 xl:col-span-6"}`}
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                {discountPercent > 0 && (
                  <span className="sm:hidden inline-flex items-center text-[10px] sm:text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                    {Math.round(discountPercent)}% OFF
                  </span>
                )}

                <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold text-[#0f172a] leading-sung tracking-tight mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] flex items-center gap-2 flex-wrap sm:mt-2">
                  {product.data.productName}
                </h1>

                <div className="flex items-center gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = product?.data?.totalReviewRating || 0;
                      const isFull = i < Math.floor(rating);
                      const isHalf = !isFull && i < rating;
                      return (
                        <span
                          key={i}
                          className="relative"
                          style={{ width: 14, height: 14 }}
                        >
                          <Star
                            size={14}
                            fill="none"
                            stroke="#d1d5db"
                            className="absolute inset-0"
                          />
                          {isFull && (
                            <Star
                              size={14}
                              fill="#FFD700"
                              stroke="#FFD700"
                              className="absolute inset-0"
                            />
                          )}
                          {isHalf && (
                            <span
                              className="absolute inset-0 overflow-hidden"
                              style={{ width: "50%" }}
                            >
                              <Star size={14} fill="#FFD700" stroke="#FFD700" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                    <span className="ml-2 text-xs text-gray-500">
                      {product?.data?.totalReviewCounts > 0
                        ? `${product.data.totalReviewRating} (${product.data.totalReviewCounts} reviews)`
                        : "No reviews yet"}
                    </span>

                    <span className="w-px h-4 bg-gray-300 mx-2" />

                    {product.data.productSoldText && (
                      <span className="text-[11px] text-gray-500">
                        {product.data.productSoldText}+ sold
                      </span>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    {/* Wishlist Button */}
                    <WishlistButton
                      className="p-2.5 bg-[#fffaf5] hover:bg-warm border border-gray-200"
                      isLiked={isLiked}
                      onToggle={handleWishlistToggle}
                    />

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="p-2.5 bg-[#fffaf5] hover:bg-warm border border-gray-200 rounded-full transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <ProductPrice
                currentPrice={currentPrice}
                originalPrice={originalPrice}
                discountPercent={discountPercent}
                taxPercent={priceInfo?.taxPercent}
              />

              {/* Short Description */}
              <div
                className="text-gray-600 leading-relaxed text-sm max-w-none prose prose-sm mb-3 sm:mb-0"
                dangerouslySetInnerHTML={{
                  __html: product.data.productShortDesc,
                }}
              />

              {/* Options & Configuration */}
              <div className="hidden sm:block">
                <ProductOptions
                  product={product}
                  selectedOptions={selectedOptions}
                  handleSelect={handleSelect}
                  shakeOptions={shakeOptions}
                  setShakeOptions={setShakeOptions}
                />
              </div>

              {/* Actions Section */}
              <ProductActions
                product={product}
                selectedPack={selectedPack}
                mainImage={mainImage}
                activeVariantImage={activeVariantImage}
                selectedOptions={selectedOptions}
                currentPrice={currentPrice}
                onShakeOptions={() => {
                  setShakeOptions(true);
                  setTimeout(() => setShakeOptions(false), 500);
                }}
              />

              {/*  Features */}
              <ProductFeatures />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs
          productDescription={product.data.productDescription}
          reviews={reviews}
          reviewsLoading={reviewsLoading}
        />

        {/* Related Products Section */}
        {relatedProductsCount > 0 && (
          <div className="mt-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <SectionHeading title="You may also like" />
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Explore similar products in{" "}
                  {product?.data.productCategoryName}
                </p>
              </div>

              <Link
                to="/shop"
                className="text-[11px] sm:text-[13px] font-semibold text-accent uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                Shop More
                <ChevronRight size={14} />
              </Link>
            </div>

            <RelatedProducts
              category={product?.data.productCategoryName || ""}
              currentProductId={product?.data.productId}
              allProducts={allProducts}
            />
          </div>
        )}
      </div>

      <MobileActionBar
        product={product}
        selectedPack={selectedPack}
        selectedOptions={selectedOptions}
        currentPrice={currentPrice}
        mainImage={mainImage}
        activeVariantImage={activeVariantImage}
        isLiked={isLiked}
        onWishlistToggle={handleWishlistToggle}
        onShare={handleShare}
        handleSelect={handleSelect}
      />
    </>
  );
};

export default ProductPage;
