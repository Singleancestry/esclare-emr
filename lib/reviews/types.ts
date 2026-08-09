export type ReviewSource = "google" | "facebook" | "manual" | "other";

export type PublicReview = {
  id: string;
  reviewerDisplayName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
  source: ReviewSource;
  originalReviewUrl: string | null;
  sourceProfileUrl: string | null;
  verified: boolean;
  featured: boolean;
  clinicResponse: string | null;
};

export type ManagedReview = PublicReview & {
  published: boolean;
  displayOrder: number;
  importedAt: string;
  lastCheckedAt: string | null;
  adminNotes: string | null;
  archivedAt: string | null;
};
