import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { ReviewCard } from "./review-card";
import { getPublishedReviews } from "@/lib/reviews/data";

export async function HomepageReviews() {
  const reviews = await getPublishedReviews({ featuredOnly: true, limit: 6 });
  if (!reviews.length) return null;
  return (
    <section className="bg-[#F4E8DA] py-16 sm:py-20">
      <div className="public-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="public-eyebrow">Client experiences</p>
            <h2 className="public-subheading mt-3">Featured reviews</h2>
          </div>
          <Link
            href={"/reviews" as Route}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#6F263D]"
          >
            View more reviews <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
