import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Tag,
  ChevronRight,
  ShoppingCart,
  Loader,
  Share2,
  Zap,
  Check,
  CheckCircle2,
} from "lucide-react";

import SEO from "../../components/SEO";
import ProductImages from "../ProductPage/components/ProductImages";
import { getCart, setCart } from "../../utils/cartStorage";
// Imports End----

const DealDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const {
    data: deal,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deal", slug],
    queryFn: async () => {
      const res = await fetch(`/api/deal/slug/${slug}`);
      if (!res.ok) throw new Error("Deal not found");
      return res.json();
    },
    retry: false,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Auto-select first variant for each product
  useEffect(() => {
    if (deal?.products) {
      const initial = {};
      deal.products.forEach((product) => {
        const activeVariants = (product.variants || []).filter(
          (v) => v.isActive !== false,
        );
        if (activeVariants.length > 0) {
          initial[product._id] = activeVariants[0];
        }
      });
      setSelectedVariants(initial);
    }
  }, [deal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !deal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Deal not found</p>
        <Link
          to="/deals"
          className="text-accent text-sm font-bold hover:underline"
        >
          Back to Deals
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: deal?.title,
          text: `Check out ${deal?.title} - Rs. ${deal?.dealPrice?.toLocaleString()}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      // User cancelled or error
    }
  };

  const images = deal.images || [];
  const savings = deal.originalPrice ? deal.originalPrice - deal.dealPrice : 0;

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const allVariantsSelected = deal.products?.every(
    (p) =>
      !(p.variants || []).filter((v) => v.isActive !== false).length ||
      selectedVariants[p._id],
  );

  const handleBuyNow = () => {
    if (!deal.products || deal.products.length === 0) {
      toast.error("No products in this deal");
      return;
    }

    if (!allVariantsSelected) {
      toast.error("Please select variants for all products");
      return;
    }

    const productsWithVariants = deal.products.map((p) => ({
      ...p,
      selectedVariant: selectedVariants[p._id] || null,
    }));

    navigate("/place-order", {
      state: {
        dealProducts: productsWithVariants,
        totalAmount: deal.dealPrice * quantity,
        dealType: deal.title,
        dealId: deal._id,
        dealImage: deal.images?.[0]?.url || "",
        dealQuantity: quantity,
      },
    });
  };

  const handleAddToCart = () => {
    if (!allVariantsSelected) {
      toast.error("Please select variants for all products");
      return;
    }

    const existingCart = getCart();

    const cartItem = {
      productId: deal._id,
      productSlug: deal.slug,
      name: deal.title,
      image: deal.images?.[0]?.url || "",
      price: deal.dealPrice,
      quantity: quantity,
      total: deal.dealPrice * quantity,
      selectedOptions: Object.fromEntries(
        Object.entries(selectedVariants).map(([pid, v]) => [pid, v.name]),
      ),
      variantId: null,
      selectedVariants: Object.values(selectedVariants).map((v) => ({
        detailName: v.name,
      })),
      isDealItem: true,
      dealId: deal._id,
    };

    const existingIndex = existingCart.findIndex(
      (item) => item.dealId === deal._id,
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
      existingCart[existingIndex].total =
        existingCart[existingIndex].price *
        existingCart[existingIndex].quantity;
    } else {
      existingCart.unshift(cartItem);
    }

    setCart(existingCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Deal added to cart!");
    setTimeout(() => {
      window.dispatchEvent(new Event("openCartDrawer"));
    }, 300);
  };

  return (
    <div className="min-h-screen -mt-1.5 sm:mt-0 pb-10 sm:pb-4 sm:py-3 sm:px-[4vw]">
      <SEO
        title={deal.title}
        description={
          deal.description || `Get ${deal.title} at special deal price`
        }
        keywords="deal, offer, discount"
        url={`/deals/${deal.slug}`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
        <Link to="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/deals" className="hover:text-accent transition-colors">
          Deals
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium line-clamp-1">
          {deal.title}
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Images */}
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {images.length > 0 ? (
            <div className="relative">
              <ProductImages images={images} />
              <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  <Tag size={12} />
                  DEAL
                </span>
                {savings > 0 && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    SAVE Rs. {savings.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-84 sm:h-80 lg:h-96 xl:h-122 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Tag size={60} className="text-gray-200" />
            </div>
          )}
        </Motion.div>

        {/* Details */}
        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
          {/* Title & Share */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-heading flex-1">
              {deal.title}
            </h1>
            <button
              onClick={handleShare}
              className="shrink-0 p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-black text-accent">
              Rs. {deal.dealPrice?.toLocaleString()}
            </span>
            {deal.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                Rs. {deal.originalPrice.toLocaleString()}
              </span>
            )}
            {savings > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {Math.round((savings / deal.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          {deal.description && (
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {deal.description}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Quantity
              </label>
              <div className="flex items-center bg-[#fff8f8] border border-gray-200/80 rounded-full p-1 mt-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-sm font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-10 text-center bg-transparent focus:outline-none font-bold text-gray-900 select-none [&::-webkit-outer-spin-button]:appearance-none [&]:moz-appearance:textfield"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Price
              </p>
              <p className="text-xl font-bold text-gray-900">
                Rs {(deal.dealPrice * quantity).toLocaleString()}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-bold py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-[1.5] flex items-center justify-center gap-2 bg-linear-to-r from-accent to-pink-500 text-white text-sm font-bold py-3.5 rounded-full hover:opacity-90 transition-colors cursor-pointer"
            >
              <Zap size={16} />
              Buy It Now - Rs {(deal.dealPrice * quantity)?.toLocaleString()}
            </button>
          </div>
        </Motion.div>
      </div>

      {/* Related Products */}
      {deal.products &&
        deal.products.length > 0 &&
        (() => {
          const productsWithVariants = deal.products.filter(
            (p) => (p.variants || []).filter((v) => v.isActive !== false).length > 0,
          );
          const selectedCount = productsWithVariants.filter(
            (p) => selectedVariants[p._id],
          ).length;
          const totalRequired = productsWithVariants.length;

          return (
            <div className="mt-12 sm:mt-16">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-heading">
                  Products in this Deal
                </h2>

                {totalRequired > 0 && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${selectedCount === totalRequired ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {selectedCount === totalRequired ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Check size={14} />
                    )}
                    {selectedCount}/{totalRequired} selected
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-4">
                {totalRequired > 0 && selectedCount < totalRequired
                  ? "Select a variant for each product to continue"
                  : "Everything included in this bundle deal"}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {deal.products.map((product) => {
                  const activeVariants = (product.variants || []).filter(
                    (v) => v.isActive !== false,
                  );
                  const hasVariants = activeVariants.length > 0;
                  const isSelected = !!selectedVariants[product._id];
                  return (
                    <div
                      key={product._id}
                      className={`break-inside-avoid mb-2 sm:mb-0 bg-white rounded-xl overflow-hidden transition-all duration-200 ${hasVariants && !isSelected ? "border-2 border-dashed border-amber-300" : hasVariants && isSelected ? "border-2 border-accent shadow-sm" : "border border-gray-100"}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={
                            selectedVariants[product._id]?.image?.url ||
                            product.productImages?.[0]?.url
                          }
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        {hasVariants && isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-sm">
                            <Check
                              size={14}
                              className="text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}

                        {hasVariants && !isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white text-[10px] font-bold">
                              !
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1.5">
                          {product.title}
                        </p>

                        {hasVariants ? (
                          <div className="flex flex-wrap gap-1">
                            {activeVariants.map((variant) => {
                              const isVarSelected =
                                selectedVariants[product._id]?._id ===
                                variant._id;
                              return (
                                <button
                                  key={variant._id}
                                  onClick={() =>
                                    handleVariantSelect(product._id, variant)
                                  }
                                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all duration-200 ${
                                    isVarSelected
                                      ? "bg-accent text-white"
                                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                  }`}
                                >
                                  {variant.name}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            Included as-is
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default DealDetailPage;
