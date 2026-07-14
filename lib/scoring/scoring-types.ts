export type ScoreCategory =
  | "analytics"
  | "tagManagement"
  | "consent"
  | "marketing"
  | "dataQuality";

export interface CategoryScore {
  category: ScoreCategory;
  score: number;
  maxScore: number;
}

export interface AuditScore {
  globalScore: number;
  maxScore: number;
  grade: string;
  categories: CategoryScore[];
}