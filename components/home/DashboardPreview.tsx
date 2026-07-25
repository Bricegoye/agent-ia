import ScoreGauge from "./ScoreGauge";
import DetectionStatus from "./DetectionStatus";
import CategoryScores from "./CategoryScores";
import AIRecommendations from "./AIRecommendations";
import DashboardHeader from "./DashboardHeader";
import KPICards from "./KPICards";

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-xl">

        <DashboardHeader url="https://example.com" />

        {/* Score */}
        <div className="mt-14">
          <ScoreGauge score={91} />
        </div>

        {/* KPI Cards */}
        <div className="mt-14">
          <KPICards />
        </div>

        <hr className="my-16 border-slate-200" />

        {/* Detection */}
        <DetectionStatus />

        <hr className="my-16 border-slate-200" />

        {/* Category Scores */}
        <CategoryScores />

        <hr className="my-16 border-slate-200" />

        {/* AI Recommendations */}
        <AIRecommendations />

      </div>
    </div>
  );
}