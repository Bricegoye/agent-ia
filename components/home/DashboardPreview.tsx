import ScoreGauge from "./ScoreGauge";
import DetectionStatus from "./DetectionStatus";
import CategoryScores from "./CategoryScores";
import AIRecommendations from "./AIRecommendations";
import DashboardHeader from "./DashboardHeader";
import KPICards from "./KPICards";

export default function DashboardPreview() {
  return (
    <div className="mx-auto w-full max-w-4xl">

      {/* Dashboard Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 lg:p-12 lg:shadow-xl">

        {/* Dashboard Header */}
        <DashboardHeader url="https://example.com" />

        {/* Score */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <ScoreGauge score={91} />
        </div>

        {/* KPI Cards */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <KPICards />
        </div>

        {/* Separator */}
        <hr className="my-10 border-slate-200 sm:my-12 lg:my-16" />

        {/* Detection */}
        <DetectionStatus />

        {/* Separator */}
        <hr className="my-10 border-slate-200 sm:my-12 lg:my-16" />

        {/* Category Scores */}
        <CategoryScores />

        {/* Separator */}
        <hr className="my-10 border-slate-200 sm:my-12 lg:my-16" />

        {/* AI Recommendations */}
        <AIRecommendations />

      </div>
    </div>
  );
}