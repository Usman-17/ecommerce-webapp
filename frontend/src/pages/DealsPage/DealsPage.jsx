import LottieComponent from "lottie-react";
import emptyAnimation from "../../assets/lottie/Empty.json";

import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Tag } from "lucide-react";

import { useGetAllDeals } from "../../hooks/useGetAllDeals";

import SEO from "../../components/SEO";
import dealsBanner from "../../assets/deals.webp";
// Imports End------

const Lottie = LottieComponent?.default || LottieComponent;

const DealsPage = () => {
  const { deals, dealIsLoading } = useGetAllDeals();

  return (
    <div className="min-h-screen -mt-1.5 sm:mt-0 pb-10 sm:pb-4 sm:py-3 sm:px-[4vw]">
      <SEO
        title="Deals"
        description="Grab the best deals on jewelry, makeup & beauty products, and hair accessories at Jemzy. Limited time offers you don't want to miss."
        keywords="deals, offers, discounts, sale, jewelry deals, makeup deals"
        url="/deals"
      />

      {/* Banner */}
      <div className="mb-6">
        <img
          src={dealsBanner}
          alt="Deals"
          className="w-full h-40 sm:h-68 object-cover rounded-lg"
        />
      </div>

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-heading">
            Latest <span className="text-accent">Deals</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {dealIsLoading
              ? "Loading deals..."
              : `${deals.length} deal(s) available`}
          </p>
        </div>
      </div>

      {/* Loading */}
      {dealIsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-6 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!dealIsLoading && deals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Lottie
            animationData={emptyAnimation}
            loop={false}
            className="w-64 h-64"
          />
          <p className="mt-4 text-center text-gray-500 text-sm">
            No deals available right now. Check back soon!
          </p>
        </div>
      )}

      {/* Deals Grid */}
      {!dealIsLoading && deals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {deals.map((deal, index) => (
            <Link key={deal._id} to={`/deals/${deal.slug}`} className="block">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                {/* Deal Image */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-gray-50">
                  {deal.images && deal.images.length > 0 ? (
                    <>
                      <img
                        src={deal.images[0].url}
                        alt={deal.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {deal.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          +{deal.images.length - 1} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={40} className="text-gray-200" />
                    </div>
                  )}

                  {/* Deal Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      <Tag size={10} />
                      DEAL
                    </span>
                  </div>

                  {/* Savings Badge */}
                  {deal.originalPrice &&
                    deal.originalPrice > deal.dealPrice && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          SAVE Rs.{" "}
                          {(
                            deal.originalPrice - deal.dealPrice
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                </div>

                {/* Deal Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-heading line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                    {deal.title}
                  </h3>

                  {deal.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                      {deal.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-black text-accent">
                      Rs. {deal.dealPrice?.toLocaleString()}
                    </span>
                    {deal.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {deal.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Products Preview */}
                  {deal.products && deal.products.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Includes {deal.products.length} product(s)
                      </p>
                      <div className="flex -space-x-2">
                        {deal.products.slice(0, 4).map((product) => (
                          <img
                            key={product._id}
                            src={product.productImages?.[0]?.url}
                            alt={product.title}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                        {deal.products.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
                            +{deal.products.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealsPage;
