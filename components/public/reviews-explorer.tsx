"use client";

import { useMemo, useState } from "react";
import { ReviewCard } from "./review-card";
import type { PublicReview, ReviewSource } from "@/lib/reviews/types";

export function ReviewsExplorer({ reviews }: { reviews: PublicReview[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | ReviewSource>("all");
  const [rating, setRating] = useState("all");
  const filtered = useMemo(
    () =>
      reviews.filter(
        (review) =>
          (source === "all" || review.source === source) &&
          (rating === "all" || review.rating === Number(rating)) &&
          (!query.trim() ||
            `${review.reviewerDisplayName} ${review.reviewText}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())),
      ),
    [query, rating, reviews, source],
  );
  const field = "min-h-12 border border-[#CDBA9F] bg-white px-4 text-sm text-[#43201E]";
  return (
    <div>
      <div className="grid gap-3 border-y border-[#D8C9B4] py-5 md:grid-cols-3">
        <label>
          <span className="sr-only">Search reviews</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reviews"
            className={`${field} w-full`}
          />
        </label>
        <label>
          <span className="sr-only">Filter reviews by source</span>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as "all" | ReviewSource)}
            className={`${field} w-full`}
          >
            <option value="all">All sources</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="manual">Manual testimonials</option>
            <option value="other">Other verified sources</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter reviews by rating</span>
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className={`${field} w-full`}
          >
            <option value="all">All ratings</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="mt-5 text-sm text-[#62595C]">
        {filtered.length} {filtered.length === 1 ? "review" : "reviews"}
      </p>
      {filtered.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="mt-6 border-y border-[#D8C9B4] py-12 text-center text-sm text-[#62595C]">
          No published reviews match these filters.
        </p>
      )}
    </div>
  );
}
