"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getCurrentStaffContext } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions/checks";
import { reviewArchiveSchema, reviewSchema } from "@/lib/validation/review";

export type ReviewActionState = { status: "idle" | "success" | "error"; message: string | null };

export async function saveReviewAction(
  _state: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const staff = await getCurrentStaffContext();
  if (!staff || !hasPermission(staff, "security.manage_roles"))
    return { status: "error", message: "Administrator access is required." };
  const parsed = reviewSchema.safeParse({
    ...Object.fromEntries(formData),
    verified: formData.get("verified") === "on",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success)
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the review." };
  const admin = createSupabaseAdminClient();
  if (!admin) return { status: "error", message: "Configure Supabase before saving reviews." };
  const value = parsed.data;
  const payload = {
    reviewer_display_name: value.reviewerDisplayName,
    review_text: value.reviewText,
    rating: value.rating,
    review_date: value.reviewDate.toISOString().slice(0, 10),
    source: value.source,
    original_review_url: value.originalReviewUrl,
    source_profile_url: value.sourceProfileUrl,
    verified: value.verified,
    featured: value.featured,
    published: value.published,
    display_order: value.displayOrder,
    last_checked_at: value.lastCheckedAt ? new Date(value.lastCheckedAt).toISOString() : null,
    admin_notes: value.adminNotes || null,
    clinic_response: value.clinicResponse || null,
    updated_by: staff.employee.id,
  };
  const result = value.id
    ? await admin.from("public_reviews").update(payload).eq("id", value.id).is("archived_at", null)
    : await admin.from("public_reviews").insert({
        ...payload,
        created_by: staff.employee.id,
        imported_at: new Date().toISOString(),
      });
  if (result.error) return { status: "error", message: "The review could not be saved." };
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/reviews-manager");
  return { status: "success", message: value.id ? "Review updated." : "Review added." };
}

export async function archiveReviewAction(formData: FormData) {
  const staff = await getCurrentStaffContext();
  if (!staff || !hasPermission(staff, "security.manage_roles")) return;
  const parsed = reviewArchiveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin
    .from("public_reviews")
    .update({
      archived_at: new Date().toISOString(),
      archived_by: staff.employee.id,
      archive_reason: parsed.data.reason,
      published: false,
      featured: false,
      updated_by: staff.employee.id,
    })
    .eq("id", parsed.data.id)
    .is("archived_at", null);
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/reviews-manager");
}
