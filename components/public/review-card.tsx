import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/reviews/types";

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article className="flex h-full flex-col border border-[#D8C9B4] bg-white p-6">
      <div
        className="flex items-center gap-1 text-[#B98A4D]"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            fill={index < review.rating ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-5 line-clamp-6 text-sm leading-7 text-[#62595C]">
        “{review.reviewText}”
      </blockquote>
      {review.clinicResponse && (
        <p className="mt-4 border-l border-[#B98A4D] pl-4 text-xs leading-6 text-[#62595C]">
          <strong>ESCLARE response:</strong> {review.clinicResponse}
        </p>
      )}
      <footer className="mt-auto pt-6">
        <p className="font-semibold text-[#481827]">{review.reviewerDisplayName}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-[#765A44]">
          {review.source}
          {review.verified ? " · Verified source" : ""} ·{" "}
          {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(
            new Date(review.reviewDate),
          )}
        </p>
        {review.originalReviewUrl && (
          <a
            href={review.originalReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs font-bold text-[#6F263D] underline underline-offset-4"
          >
            View original review
          </a>
        )}
      </footer>
    </article>
  );
}
