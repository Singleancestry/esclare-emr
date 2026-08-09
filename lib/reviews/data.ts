import "server-only";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import type { ManagedReview, PublicReview, ReviewSource } from "./types";

type ReviewRow = {
  id: string;
  reviewer_display_name: string;
  review_text: string;
  rating: number;
  review_date: string;
  source: ReviewSource;
  original_review_url: string | null;
  source_profile_url: string | null;
  verified: boolean;
  featured: boolean;
  published: boolean;
  display_order: number;
  imported_at: string;
  last_checked_at: string | null;
  admin_notes: string | null;
  clinic_response: string | null;
  archived_at: string | null;
};

function mapReview(row: ReviewRow): ManagedReview {
  return {
    id: row.id,
    reviewerDisplayName: row.reviewer_display_name,
    reviewText: row.review_text,
    rating: row.rating,
    reviewDate: row.review_date,
    source: row.source,
    originalReviewUrl: row.original_review_url,
    sourceProfileUrl: row.source_profile_url,
    verified: row.verified,
    featured: row.featured,
    published: row.published,
    displayOrder: row.display_order,
    importedAt: row.imported_at,
    lastCheckedAt: row.last_checked_at,
    adminNotes: row.admin_notes,
    clinicResponse: row.clinic_response,
    archivedAt: row.archived_at,
  };
}

export async function getManagedReviews(): Promise<ManagedReview[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("public_reviews")
    .select("*")
    .order("archived_at", { ascending: true, nullsFirst: true })
    .order("display_order", { ascending: true })
    .order("review_date", { ascending: false });
  if (error) return [];
  return (data as ReviewRow[]).map(mapReview);
}

export async function getPublishedReviews(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<PublicReview[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];
  let query = admin
    .from("public_reviews")
    .select("*")
    .eq("published", true)
    .is("archived_at", null)
    .order("display_order", { ascending: true })
    .order("review_date", { ascending: false });
  if (options?.featuredOnly) query = query.eq("featured", true);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) return [];
  return (data as ReviewRow[]).map(mapReview);
}
