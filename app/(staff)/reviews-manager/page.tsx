import { archiveReviewAction } from "../reviews/actions";
import { ReviewManagerForm } from "@/components/reviews/review-manager-form";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";
import { getManagedReviews } from "@/lib/reviews/data";

export default async function ReviewsManagerPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "security.manage_roles");
  const reviews = await getManagedReviews();
  return (
    <main className="p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase text-[#6F263D]">Administration</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#481827]">Reviews Manager</h1>
      <p className="mt-2 max-w-3xl text-sm text-[#5F6368]">
        Add verified public reviews manually, preserve source attribution, and control publication,
        featured placement, ordering, responses and archival.
      </p>
      <ReviewManagerForm />
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#481827]">Review inventory</h2>
        <div className="mt-4 space-y-4">
          {reviews.length === 0 && (
            <p className="rounded border border-[#D9DDE3] bg-white p-5 text-sm">
              No reviews have been added.
            </p>
          )}
          {reviews.map((review) => (
            <article key={review.id} className="rounded border border-[#D9DDE3] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#262626]">{review.reviewerDisplayName}</h3>
                  <p className="text-xs uppercase text-[#6F263D]">
                    {review.source} · {review.rating}/5 · {review.reviewDate}
                  </p>
                </div>
                <p className="text-xs font-semibold">
                  {review.archivedAt ? "Archived" : review.published ? "Published" : "Draft"}
                  {review.featured ? " · Featured" : ""}
                  {review.verified ? " · Verified" : ""}
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#5F6368]">{review.reviewText}</p>
              {!review.archivedAt && (
                <details className="mt-4 border-t border-[#E8EAED] pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#6F263D]">
                    Edit, publish or reorder
                  </summary>
                  <ReviewManagerForm review={review} />
                </details>
              )}
              {!review.archivedAt && (
                <form action={archiveReviewAction} className="mt-4 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={review.id} />
                  <input
                    required
                    minLength={5}
                    name="reason"
                    placeholder="Archive reason"
                    className="min-h-10 flex-1 rounded border border-[#C8CDD5] px-3 text-sm"
                  />
                  <button className="min-h-10 rounded border border-[#6F263D] px-4 text-sm font-semibold text-[#6F263D]">
                    Archive
                  </button>
                </form>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
