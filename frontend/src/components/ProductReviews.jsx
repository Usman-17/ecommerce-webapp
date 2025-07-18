import moment from "moment";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { PencilLine, Star, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "./LoadingSpinner";
import ReviewsSkeleton from "./Skeleton/ReviewsSkeleton";
// Imports End

const ProductReviews = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const reviewFormRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  //   Get All Reviews Query
  const { data: reviews = [], isLoading: reviewsIsLoading } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      const res = await fetch(`/api/review/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },

    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    retry: false,
  });

  //   Add Review Mutation
  const { mutate: addReview, isPending: isAdding } = useMutation({
    mutationFn: async ({ productId, rating, comment }) => {
      const res = await fetch("/api/review/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) throw new Error("Failed to add review");
      return res.json();
    },

    onSuccess: () => {
      setRating(0);
      setComment("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", slug] });
    },

    onError: (err) => toast.error(err.message || "Error adding review"),
  });

  //   Update Review Mutation
  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: async ({ reviewId, rating, comment }) => {
      const res = await fetch(`/api/review/update/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) throw new Error("Failed to update review");
      return res.json();
    },

    onSuccess: () => {
      setSelectedReview(null);
      setRating(0);
      setComment("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", slug] });
    },

    onError: () => toast.error("Failed to update review"),
  });

  //   Delete Review Mutation
  const { mutate: deleteReview } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/review/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", slug] });
    },

    onError: () => toast.error("Error deleting review"),
  });

  const alreadyReviewed = reviews.find((r) => r?.user?._id === authUser?._id);

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowForm(true);

    // Scroll to the form smoothly after a tiny delay
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment) {
      toast.error("Rating and comment required");
      return;
    }

    if (selectedReview) {
      updateReview({ reviewId: selectedReview._id, rating, comment });
    } else {
      addReview({ productId: slug, rating, comment });
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  if (reviewsIsLoading) return <ReviewsSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Average Rating */}
          <p className="font-semibold text-lg">Average Rating:</p>
          <div className="flex gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={18}
                fill={idx < Math.round(averageRating) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
          </div>

          <span className="text-gray-600 text-sm">
            ({averageRating.toFixed(1)} / 5)
          </span>
        </div>

        {/* Total Reviws */}
        <div className="text-center md:text-left text-sm text-gray-700">
          {reviews?.length} review{reviews?.length === 1 ? "" : "s"}
        </div>
      </div>

      {authUser && (!alreadyReviewed || selectedReview) && !showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setShowForm(true);
              setSelectedReview(null);
            }}
            className="hover:text-black mt-1 sm:mt-0 transition-opacity duration-200 text-sm underline"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {authUser && showForm && (
        <form
          onSubmit={handleFormSubmit}
          ref={reviewFormRef}
          className="border rounded p-4 bg-[#fffaf1]"
        >
          <h3 className="text-lg font-semibold mb-2">
            {selectedReview ? "Edit Review" : "Write a Review"}
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Your Rating
            </label>

            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={20}
                  className={`cursor-pointer ${
                    idx < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  fill={idx < rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  onClick={() => setRating(idx + 1)}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Your Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm bg-[#fffaf1]"
              placeholder="Write your review..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isAdding || isUpdating ? (
                selectedReview ? (
                  <LoadingSpinner content="Updating..." />
                ) : (
                  <LoadingSpinner content="Submitting..." />
                )
              ) : selectedReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedReview(null);
                setRating(0);
                setComment("");
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.slice(0, visibleCount).map((review) => (
          <div
            key={review._id}
            className="flex items-start gap-4 border-b pb-4"
          >
            <img
              src={review?.user?.profileImg?.url || "/avatar-placeholder.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-semibold text-gray-800">
                  {review?.user?.fullName || "Anonymous"}
                </p>

                {(authUser?._id === review?.user?._id ||
                  authUser?.role === "admin") && (
                  <div className="flex gap-2">
                    <Trash2
                      size={18}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() => {
                        if (window.confirm("Delete this review permanently?")) {
                          deleteReview(review._id);
                        }
                      }}
                    />
                    <PencilLine
                      size={18}
                      className="text-gray-600 hover:text-red-500 cursor-pointer"
                      onClick={() => handleEditClick(review)}
                      title="Edit Review"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      fill={idx < review.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  ))}
                </div>

                <span className="text-gray-500 text-xs">
                  {moment(review.createdAt).format("MMMM D, YYYY")}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
            </div>
          </div>
        ))
      )}

      {reviews.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 5)}
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 underline underline-offset-4 transition-colors duration-200"
        >
          Show More Reviews
        </button>
      )}
    </div>
  );
};

export default ProductReviews;
