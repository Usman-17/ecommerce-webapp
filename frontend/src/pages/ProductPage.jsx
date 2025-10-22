import { useEffect, useState } from "react";
import { ChevronDown, Dot, Redo } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

import LoadingSpinner from "../components/LoadingSpinner";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import ProductSkeleton from "../components/Skeleton/ProductSkeleton";

import { useQuery } from "@tanstack/react-query";
import { useAddToCart } from "../hooks/useAddToCart";

import ReactGA from "react-ga4";

// Imports End

const ProductPage = () => {
  const { slug } = useParams();

  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart, cartIsPending } = useAddToCart();

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Goggle Analytics
  useEffect(() => {
    if (product) {
      ReactGA.event("view_item", {
        currency: "PKR",
        value: product.price,
        items: [
          {
            item_id: product._id,
            item_name: product.title,
            item_brand: product.brand?.name,
            item_category: product.category?.name,
            price: product.price,
          },
        ],
      });
    }
  }, [product]);

  if (isLoading) return <ProductSkeleton />;
  if (!product) return <div className="p-4">Product not found.</div>;

  const mainImageUrl = product?.productImages?.[0]?.url || "";

  const handleImageClick = (url) => setActiveImage(url);

  const handleAddToCart = (itemId, color, quantity) => {
    addToCart({ itemId, color, quantity });

    //  Goggle Analytics add_to_cart event
    ReactGA.event("add_to_cart", {
      currency: "PKR",
      value: product.price * quantity,
      items: [
        {
          item_id: product._id,
          item_name: product.title,
          item_brand: product.brand?.name,
          item_category: product.category?.name,
          quantity,
          price: product.price,
          item_variant: color,
        },
      ],
    });
  };

  return (
    <>
      <Helmet>
        <title>{product?.title} | Jemzy</title>
        <meta
          name="description"
          content={`Buy ${product?.title} from Jemzy. ${product?.description
            ?.replace(/<[^>]+>/g, "")
            .slice(0, 150)}...`}
        />
        <meta
          name="keywords"
          content={`Jemzy, ${product?.title}, ${product?.brand?.name}, Buy Online, ${product?.category?.name}`}
        />
        <link rel="canonical" href={`https://www.jemzy.pk/product/${slug}`} />
      </Helmet>

      <div className="border-t transition-opacity ease-in duration-500 opacity-100">
        {/* Breadcrumb  */}
        <nav
          aria-label="breadcrumb"
          className="my-4 text-sm text-gray-600 select-none hidden sm:block"
        >
          <ol className="flex items-center space-x-1">
            <li className="flex items-center">
              <Link
                to="/collection"
                className="hover:text-rose-500 transition-colors duration-200"
              >
                All Products
              </Link>
            </li>
            <li className="flex items-center">
              <Dot size={14} className="mx-1 text-gray-400" />
              <span className="font-semibold text-gray-800 sm:max-w-xs truncate">
                {product?.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 pt-5 sm:pt-0">
          {/* Images */}
          <div className="flex flex-1 flex-col-reverse sm:flex-row gap-3 sm:gap-6">
            {/* Thumbnails */}
            <div className="flex sm:flex-col sm:w-[17.5%] w-full gap-1 sm:gap-0 overflow-y-auto max-h-[510px]">
              {product?.productImages?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => handleImageClick(image.url)}
                  className="w-[20.5%] sm:w-full sm:mb-3 cursor-pointer rounded-md transition-transform duration-300 transform hover:scale-105 object-contain"
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full sm:w-[82.5%] flex items-center justify-center">
              <div className="w-full sm:h-[510px] relative">
                <InnerImageZoom
                  src={activeImage || mainImageUrl}
                  zoomType="hover"
                  zoomScale={1}
                  className="rounded-md object-contain sm:h-full w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h4 className="text-gray-600 text-sm sm:text-base uppercase">
              {product?.brand?.name || ""}
            </h4>
            <div className="flex items-center gap-3">
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                Rs. {product?.price.toLocaleString()}
              </p>

              {product?.secondaryPrice && (
                <>
                  <p className="text-base sm:text-md font-medium text-gray-500 line-through">
                    Rs. {product.secondaryPrice.toLocaleString()}
                  </p>

                  <p className="text-sm sm:text-base font-medium text-green-600">
                    (
                    {Math.round(
                      ((product.secondaryPrice - product.price) /
                        product.secondaryPrice) *
                        100
                    ).toFixed(0)}
                    % OFF)
                  </p>
                </>
              )}
            </div>

            {/* Title & Sold Out */}
            <h1
              className="font-medium text-md sm:text-lg sm:mt-1 tracking-normal sm:tracking-wide"
              style={{ lineHeight: "1.1" }}
            >
              {product?.title}
              {""}
              {product?.sold && (
                <span className="ml-2 text-xs sm:text-sm text-gray-600 font-medium">
                  ({product.sold} Sold)
                </span>
              )}
            </h1>

            {/* Category */}
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Category:{" "}
              <span className="font-medium text-gray-700">
                {product?.category.name || "N/A"}
              </span>
            </p>

            {/* Quantity Dropdown */}
            <div className="my-6 w-full max-w-xs flex items-center gap-4">
              <label
                htmlFor="quantity-select"
                className="block text-lg font-medium text-gray-700"
              >
                Quantity:
              </label>

              <div className="relative">
                <select
                  id="quantity-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="block appearance-none w-full bg-[#fffaf1] border border-gray-300 text-gray-800 py-1 px-3 pr-8 rounded-md leading-tight focus:outline-none transition duration-150 ease-in-out cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Colors */}
            {product?.colors?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">Select Color</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {product.colors.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setColor(item)}
                      className={`border py-1 px-3 text-xs sm:text-sm bg-gray-100 cursor-pointer rounded-sm ${
                        item === color ? "border-gray-800" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add To Cart Button */}
            <button
              onClick={() => handleAddToCart(product._id, color, quantity)}
              disabled={cartIsPending}
              className="uppercase bg-gray-900 text-white px-5 py-2 text-sm rounded mt-7 sm:mt-8 hover:bg-gray-950 transition duration-100 flex items-center gap-2"
            >
              {cartIsPending ? (
                <LoadingSpinner content="Adding to cart" />
              ) : (
                <>
                  Add to cart <Redo size={18} />
                </>
              )}
            </button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>

        {/* Tabs - Description & Reviews */}
        <div className="mt-10 sm:mt-20">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-5 py-3 text-sm ${
                activeTab === "description" ? "border-b-2 border-black" : ""
              }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-5 py-3 text-sm ${
                activeTab === "reviews" ? "border-b-2 border-black" : ""
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="flex flex-col gap-4 border px-3 sm:px-6 py-3 sm:py-6 text-sm">
            {activeTab === "description" ? (
              <div
                dangerouslySetInnerHTML={{ __html: product?.description || "" }}
              />
            ) : (
              <ProductReviews />
            )}
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts
          category={product.category.name || ""}
          brand={product?.brand?.name || ""}
        />
      </div>
    </>
  );
};

export default ProductPage;
