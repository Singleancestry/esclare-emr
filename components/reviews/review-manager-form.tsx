"use client";

import { useActionState } from "react";
import { saveReviewAction, type ReviewActionState } from "@/app/(staff)/reviews/actions";
import type { ManagedReview } from "@/lib/reviews/types";

const initialState: ReviewActionState = { status: "idle", message: null };

export function ReviewManagerForm({ review }: { review?: ManagedReview }) {
  const [state, action, pending] = useActionState(saveReviewAction, initialState);
  const field = "min-h-11 w-full rounded border border-[#C8CDD5] bg-white px-3 py-2 text-sm";
  return (
    <form
      action={action}
      className="mt-6 grid gap-4 rounded border border-[#D9DDE3] bg-white p-5 lg:grid-cols-2"
    >
      {review && <input type="hidden" name="id" value={review.id} />}
      <h2 className="text-xl font-semibold text-[#481827] lg:col-span-2">
        {review ? "Edit review" : "Add a verified review"}
      </h2>
      <label className="text-sm font-semibold">
        Reviewer display name
        <input
          name="reviewerDisplayName"
          required
          defaultValue={review?.reviewerDisplayName}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold">
        Review date
        <input
          name="reviewDate"
          type="date"
          required
          defaultValue={review?.reviewDate}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold lg:col-span-2">
        Review text
        <textarea
          name="reviewText"
          required
          rows={5}
          defaultValue={review?.reviewText}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold">
        Rating
        <select
          name="rating"
          defaultValue={String(review?.rating ?? 5)}
          className={`${field} mt-2`}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating}>{rating}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Source
        <select name="source" defaultValue={review?.source ?? "google"} className={`${field} mt-2`}>
          <option value="google">Google</option>
          <option value="facebook">Facebook</option>
          <option value="manual">Manual testimonial</option>
          <option value="other">Other verified source</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        Original review URL
        <input
          name="originalReviewUrl"
          type="url"
          defaultValue={review?.originalReviewUrl ?? ""}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold">
        Source profile URL
        <input
          name="sourceProfileUrl"
          type="url"
          defaultValue={review?.sourceProfileUrl ?? ""}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold">
        Display order
        <input
          name="displayOrder"
          type="number"
          min="0"
          defaultValue={review?.displayOrder ?? 100}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold">
        Date last checked
        <input
          name="lastCheckedAt"
          type="datetime-local"
          defaultValue={review?.lastCheckedAt?.slice(0, 16) ?? ""}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold lg:col-span-2">
        Optional clinic response
        <textarea
          name="clinicResponse"
          rows={3}
          defaultValue={review?.clinicResponse ?? ""}
          className={`${field} mt-2`}
        />
      </label>
      <label className="text-sm font-semibold lg:col-span-2">
        Admin notes
        <textarea
          name="adminNotes"
          rows={3}
          defaultValue={review?.adminNotes ?? ""}
          className={`${field} mt-2`}
        />
      </label>
      <div className="flex flex-wrap gap-5 lg:col-span-2">
        <label>
          <input
            name="verified"
            type="checkbox"
            defaultChecked={review?.verified}
            className="mr-2"
          />
          Verified
        </label>
        <label>
          <input
            name="featured"
            type="checkbox"
            defaultChecked={review?.featured}
            className="mr-2"
          />
          Featured
        </label>
        <label>
          <input
            name="published"
            type="checkbox"
            defaultChecked={review?.published}
            className="mr-2"
          />
          Published
        </label>
      </div>
      {state.message && (
        <p role="status" className="text-sm lg:col-span-2">
          {state.message}
        </p>
      )}
      <button disabled={pending} className="luxury-button justify-self-start lg:col-span-2">
        {pending ? "Saving…" : review ? "Save changes" : "Add review"}
      </button>
    </form>
  );
}
