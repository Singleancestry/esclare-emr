import type { Metadata } from "next";
import Link from "next/link";
import { ReviewsExplorer } from "@/components/public/reviews-explorer";
import { getPublishedReviews } from "@/lib/reviews/data";
import { clinicBranches } from "@/lib/clinic/details";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read verified, source-attributed client reviews published by ESCLARE.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();
  const reviewLinks = [
    ["Leave a Google Review", process.env.NEXT_PUBLIC_ESCLARE_GOOGLE_REVIEW_URL],
    ["View Google Reviews", process.env.NEXT_PUBLIC_ESCLARE_GOOGLE_REVIEWS_URL],
    [
      "Recommend Us on Facebook",
      process.env.NEXT_PUBLIC_ESCLARE_FACEBOOK_RECOMMEND_URL ?? clinicBranches[0]?.facebook,
    ],
    [
      "View on Facebook",
      process.env.NEXT_PUBLIC_ESCLARE_FACEBOOK_URL ?? clinicBranches[0]?.facebook,
    ],
  ] as const;
  return (
    <main>
      <section className="border-b border-[#D8C9B4] bg-[#F4E8DA] py-14 sm:py-20">
        <div className="public-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[#765A44]">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">Reviews</span>
          </nav>
          <p className="public-eyebrow mt-9">Client experiences</p>
          <h1 className="public-heading mt-4">Reviews and testimonials</h1>
          <p className="mt-5 max-w-3xl leading-8 text-[#62595C]">
            Published reviews retain their source attribution and are reviewed before appearing
            here. Individual experiences vary and are not guarantees of treatment results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" aria-label="Review platforms">
            {reviewLinks.map(([label, href], index) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={index === 0 ? "luxury-button" : "luxury-button-outline"}
                >
                  {label}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="public-container">
          {reviews.length ? (
            <ReviewsExplorer reviews={reviews} />
          ) : (
            <div className="border-y border-[#D8C9B4] py-14 text-center">
              <h2 className="text-2xl text-[#481827]">Verified reviews will appear here.</h2>
              <p className="mt-3 text-sm text-[#62595C]">
                ESCLARE publishes only reviews with confirmed source information.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
