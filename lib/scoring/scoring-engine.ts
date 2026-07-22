import { scoringRules } from "./scoring-rules";

import type {
  AuditScore,
  CategoryScore,
  ScoreCategory,
} from "./scoring-types";

const categories: ScoreCategory[] = [
  "analytics",
  "tagManagement",
  "consent",
  "marketing",
  "dataQuality",
];

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";

  return "F";
}

export class ScoringEngine {
  calculate(matchedRuleIds: string[]): AuditScore {
    const categoryScores: CategoryScore[] = categories.map((category) => {
      const categoryRules = scoringRules.filter(
        (rule) => rule.category === category
      );

      const maxScore = categoryRules.reduce(
        (total, rule) => total + rule.points,
        0
      );

      const score = categoryRules
        .filter((rule) => matchedRuleIds.includes(rule.id))
        .reduce((total, rule) => total + rule.points, 0);

      return {
        category,
        score,
        maxScore,
      };
    });

    const rawScore = categoryScores.reduce(
      (total, category) => total + category.score,
      0
    );

    const rawMaxScore = categoryScores.reduce(
      (total, category) => total + category.maxScore,
      0
    );

    const globalScore =
      rawMaxScore > 0
        ? Math.round((rawScore / rawMaxScore) * 100)
        : 0;

    return {
      globalScore,
      maxScore: 100,
      grade: getGrade(globalScore),
      categories: categoryScores,
    };
  }
}