export type ReviewStatus = "pending" | "approved" | "rejected";

export interface PublicReview {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  reviewText: string;
  reason: string | null;
  isDemo: boolean;
  createdAt: string;
}

export interface AdminReview extends PublicReview {
  status: ReviewStatus;
}
