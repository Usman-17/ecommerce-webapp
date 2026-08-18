import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronRight, Star, Share2 } from "lucide-react";

import { useWishlist } from "../../hooks/useWishlist";
import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import useEcommerce from "../../hooks/useEcommerce";

import NotFound from "../../components/NotFound";
import SectionHeading from "../../components/SectionHeading";
import WishlistButton from "../../components/WishlistButton";
import Breadcrumbs from "../../components/common/Breadcrumbs";

import ProductPrice from "./components/ProductPrice";
import ProductImages from "./components/ProductImages";
import ProductActions from "./components/ProductActions";
import ProductOptions from "./components/ProductOptions";
import RelatedProducts from "./components/RelatedProducts";
import ProductSkeleton from "./components/ProductSkeleton";
import MobileActionBar from "./components/MobileActionBar";
import ProductReviews from "./components/ProductReviews";
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
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/product/slug/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const json = await res.json();
      return json.data || json;
    },
    retry: false,
  });

  const { products: allProducts = [] } = useGetAllProducts();

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["productReviews", product?._id],
    enabled: !!product?._id,

    queryFn: async () => {
      const res = await fetch(`/api/product-review/${product._id}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { trackViewItem, trackAddToWishlist, trackRemoveFromWishlist } =
    useEcommerce();

  const isLiked = isInWishlist(product?._id);

  const mainImageUrl = useMemo(
    () => product?.productImages?.[0]?.url || "",
    [product],
  );

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isLiked) {
      removeFromWishlist(product._id);
      trackRemoveFromWishlist(product);
    } else {
      addToWishlist({
        _id: product._id,
        productId: product._id,
        productName: product.title,
        productSlug: product.slug,
        productImageURL: mainImageUrl,
        netSalePrice: product.price,
        productSalePrice: product.secondaryPrice,
      });
      trackAddToWishlist(product);
    }
  };

  const handleShare = async () => {
    const salePrice = matchedVariant?.price || product?.salePrice;
    const shareText = salePrice
      ? `Check out ${product?.title} - PKR ${salePrice.toLocaleString()} only at Jemzy!`
      : `Check out ${product?.title} at Jemzy!`;
    const shareUrl = `${window.location.origin}/product/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      // User cancelled or error
    }
  };

  const [prevProductId, setPrevProductId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [shakeOptions, setShakeOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (product && product._id !== prevProductId) {
    setPrevProductId(product._id);
    setSelectedOptions({});
    setQuantity(1);
  }

  useEffect(() => {
    if (quantity < 2) {
      setSelectedOptions((prev) => {
        const updated = { ...prev };
        let changed = false;
        Object.keys(updated).forEach((key) => {
          if (updated[key] === "Mix") {
            delete updated[key];
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }
  }, [quantity]);

  const images = useMemo(() => {
    if (!product?.productImages) return [];
    return product.productImages
      .filter(Boolean)
      .map((img) => ({ url: img.url || img }))
      .filter((img) => img.url);
  }, [product]);

  const mainImage = images[0]?.url || "";

  const selectedVariants = useMemo(() => {
    if (!product?.variants) return [];
    const activeVariants = product.variants.filter((v) => v.isActive !== false);
    return Object.entries(selectedOptions)
      .filter(([key]) => key.startsWith("variant_"))
      .filter(([, val]) => val)
      .map(([, name]) => activeVariants.find((v) => v.name === name))
      .filter(Boolean);
  }, [product, selectedOptions]);

  const matchedVariant =
    selectedVariants.length > 0
      ? selectedVariants[selectedVariants.length - 1]
      : null;

  const activeVariantImage = matchedVariant?.image?.url || mainImage;

  const handleSelect = (optionId, detailId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: detailId,
    }));
  };

  const price = matchedVariant?.price ?? product?.price ?? 0;
  const secondaryPrice = product?.secondaryPrice;
  const discountPercent =
    secondaryPrice && secondaryPrice > price
      ? Math.round(((secondaryPrice - price) / secondaryPrice) * 100)
      : 0;
  const currentPrice = price;
  const originalPrice = secondaryPrice || price;

  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product && mainImage) {
      trackViewItem(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id, mainImage, trackViewItem]);

  const recentlyViewedRef = useRef({
    mainImage,
    currentPrice,
    originalPrice,
    product,
  });

  recentlyViewedRef.current = {
    mainImage,
    currentPrice,
    originalPrice,
    product,
  };

  useEffect(() => {
    const {
      mainImage: img,
      currentPrice: p,
      originalPrice: orig,
      product: prod,
    } = recentlyViewedRef.current;
    if (prod && img) {
      addRecentlyViewed({
        productId: prod._id,
        productName: prod.title,
        productSlug: prod.slug,
        productImageURL: img,
        netSalePrice: p,
        productSalePrice: orig,
      });
    }
  }, [product?._id, addRecentlyViewed]);

  const relatedProductsCount = useMemo(() => {
    if (
      !allProducts ||
      allProducts.length === 0 ||
      !product?._id ||
      !product?.categoryName
    )
      return 0;

    const currentId = String(product._id);
    return allProducts.filter((item) => {
      const itemId = String(item._id);
      const isSameProduct = itemId === currentId;
      return item.categoryName === product.categoryName && !isSameProduct;
    }).length;
  }, [allProducts, product]);

  if (isLoading) return <ProductSkeleton />;
  if (!isValidSlug || !product) return <NotFound />;

  return (
    <>
      <SEO
        title={product.title}
        description={
          product.description?.replace(/<[^>]+>/g, "").slice(0, 160) || ""
        }
        image={mainImage}
        url={`/product/${slug}`}
        type="product"
        breadcrumbs={[
          { name: "Home", url: "/" },
          {
            name: product.areaName,
            url: `/shop?area=${encodeURIComponent(product.areaName)}`,
          },
          {
            name: product.categoryName,
            url: `/shop?area=${encodeURIComponent(product.areaName)}&category=${encodeURIComponent(product.categoryName)}`,
          },
          { name: product.title },
        ]}
        product={{
          name: product.title,
          slug,
          description:
            product.description?.replace(/<[^>]+>/g, "").slice(0, 300) || "",
          images: images.map((img) => img.url).filter(Boolean),
          price: matchedVariant?.price || product.price,
          currency: "PKR",
          inStock:
            (product.variants?.filter((v) => v.isActive !== false)?.length ||
              0) > 0,
          brand: "Jemzy",
        }}
      />
      <div className="py-3 sm:px-[4vw]" key={product._id}>
        {/* Desktop Breadcrumb */}
        <div className="hidden sm:block px-2">
          <Breadcrumbs
            items={[
              product.areaName && {
                label: product.areaName,
                path: `/shop?area=${encodeURIComponent(product.areaName)}`,
              },
              product.categoryName && {
                label: product.categoryName,
                path: `/shop?area=${encodeURIComponent(product.areaName)}&category=${encodeURIComponent(product.categoryName)}`,
              },
              product.subCategoryName && {
                label: product.subCategoryName,
                path: `/shop?area=${encodeURIComponent(product.areaName)}&category=${encodeURIComponent(product.categoryName)}&subcategory=${encodeURIComponent(product.subCategoryName)}`,
              },
              {
                label:
                  product.title.length > 50
                    ? product.title.slice(0, 50) + "..."
                    : product.title,
              },
            ].filter(Boolean)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10 -mt-4 sm:mt-0">
          {/* Images Section */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="space-y-12">
              <ProductImages
                images={images}
                activeVariantImage={activeVariantImage}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="space-y-2 sm:space-y-0">
              <div className="space-y-1">
                {discountPercent > 0 && (
                  <span className="sm:hidden inline-flex items-center text-[10px] sm:text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                    {discountPercent}% OFF
                  </span>
                )}

                <h1 className="text-lg sm:text-2xl lg:text-2xl font-bold text-[#0f172a] leading-snug tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] flex items-center gap-2 flex-wrap sm:mt-1">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const avgRating = product?.avgRating || 0;
                      const isFull = i < Math.floor(avgRating);
                      const isHalf = !isFull && i < avgRating;
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
                      {product?.reviewCount > 0
                        ? `${product.avgRating} (${product.reviewCount} reviews)`
                        : "No reviews yet"}
                    </span>

                    <span className="w-px h-4 bg-gray-300 mx-2" />

                    {product.sold > 0 && (
                      <span className="text-[11px] text-gray-500">
                        {product.sold}+ sold
                      </span>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <WishlistButton
                      className="p-2.5 bg-[#fffaf5] hover:bg-warm border border-gray-200"
                      isLiked={isLiked}
                      onToggle={handleWishlistToggle}
                    />

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
                bulkPricing={product.bulkPricing || []}
                onTierClick={(qty) => setQuantity(qty)}
                activeQuantity={quantity}
              />

              {/* Short Description */}
              <div
                className="text-gray-600 leading-relaxed text-[12px] sm:text-sm max-w-none prose prose-sm mb-3 sm:mb-0 mt-3"
                dangerouslySetInnerHTML={{
                  __html: product.description,
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
                  hasBulkPricing={(product.bulkPricing || []).length > 0}
                  quantity={quantity}
                />
              </div>

              {/* Actions Section */}
              <ProductActions
                product={product}
                selectedPack={null}
                mainImage={mainImage}
                activeVariantImage={activeVariantImage}
                selectedOptions={selectedOptions}
                matchedVariant={matchedVariant}
                selectedVariants={selectedVariants}
                currentPrice={currentPrice}
                quantity={quantity}
                setQuantity={setQuantity}
                onShakeOptions={() => {
                  setShakeOptions(true);
                  setTimeout(() => setShakeOptions(false), 500);
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        {reviews?.length > 0 && (
          <ProductReviews reviews={reviews} reviewsLoading={reviewsLoading} />
        )}

        {/* Related Products Section */}
        {relatedProductsCount > 0 && (
          <div className="mt-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <SectionHeading title="You may also like" />
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Explore similar products in {product.categoryName}
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
              category={product.categoryName || ""}
              currentProductId={product._id}
              allProducts={allProducts}
            />
          </div>
        )}
      </div>

      <MobileActionBar
        product={product}
        selectedPack={null}
        selectedOptions={selectedOptions}
        matchedVariant={matchedVariant}
        selectedVariants={selectedVariants}
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
