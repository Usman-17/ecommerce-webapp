import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const ProductReviews = ({ reviews = [] }) => {
  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : 0;

  const [sortBy, setSortBy] = useState("Most Recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3) return "Average";
    if (rating >= 2) return "Poor";
    return "Very Poor";
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
    }
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    if (sortBy === "Lowest Rated") return a.rating - b.rating;
    return 0;
  });

  const sortOptions = ["Most Recent", "Highest Rated", "Lowest Rated"];

  return (
    <div className="mt-8 sm:mt-6">
      <div className="py-2 sm:py-4">
        <AnimatePresence mode="wait">
          {reviewCount > 0 ? (
            <Motion.div
              key="reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F3E7DC]">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900">
                    Customer Reviews ({reviewCount})
                  </h3>
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors"
                    >
                      Sort by
                      <span className="font-medium text-gray-800">
                        {sortBy}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {sortOpen && (
                      <div className="absolute left-0 sm:right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-37.5">
                        {sortOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-warm transition-colors ${
                              sortBy === option
                                ? "font-medium text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                  {/* Average Rating */}
                  <div className="text-center shrink-0 w-full lg:w-auto lg:border-r lg:border-gray-100 lg:pr-8 pb-4 lg:pb-0">
                    <div className="text-4xl sm:text-5xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5 mt-2 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={
                            i < Math.round(averageRating) ? "#FFD700" : "none"
                          }
                          stroke={
                            i < Math.round(averageRating)
                              ? "#FFD700"
                              : "#d1d5db"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {getRatingLabel(averageRating)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Based on {reviewCount} reviews
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="hidden lg:block flex-1 w-full space-y-2 sm:space-y-2.5">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        reviews.filter((r) => Math.round(r.rating) === rating)
                          .length || 0;
                      const percentage =
                        reviewCount > 0 ? (count / reviewCount) * 100 : 0;

                      return (
                        <div
                          key={rating}
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <span className="text-xs sm:text-sm text-gray-500 w-3">
                            {rating}
                          </span>
                          <Star size={12} fill="#FFD700" stroke="#FFD700" />
                          <div className="flex-1 h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 w-6 sm:w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  {sortedReviews.slice(0, visibleCount).map((review, index) => (
                    <div
                      key={review._id}
                      className={`flex items-start gap-3 sm:gap-4 ${
                        index < Math.min(visibleCount, sortedReviews.length) - 1
                          ? "pb-4 mb-4 border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-warm flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-[#bfb3a8]">
                          {(review.fullName || "A").charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {review.fullName || "Anonymous"}
                          </h4>
                          {(review.date || review.createdAt) && (
                            <span className="text-[10px] sm:text-xs text-gray-400 shrink-0 whitespace-nowrap">
                              {new Date(
                                review.date || review.createdAt,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < review.rating ? "#FFD700" : "none"}
                              stroke={i < review.rating ? "#FFD700" : "#d1d5db"}
                            />
                          ))}
                        </div>

                        {review.review && (
                          <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                            {review.review}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {visibleCount < sortedReviews.length && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-warm hover:border-gray-300 transition-all"
                      >
                        Load More Reviews
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Motion.div>
          ) : (
            <Motion.div
              key="no-reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F3E7DC]">
                <p className="text-gray-500 text-sm text-center py-8">
                  No reviews yet
                </p>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductReviews;
