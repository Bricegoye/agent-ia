import {
  BrainCircuit,
  TriangleAlert,
} from "lucide-react";

export default function AIRecommendations() {
  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
        AI Recommendations
      </h3>

      <div className="space-y-4">

        {/* Recommendation 1 */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 transition-all duration-300 hover:shadow-md">

          <div className="flex items-start justify-between gap-4">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">
                <BrainCircuit className="h-5 w-5 text-sky-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Configure Advanced Consent Mode
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Improve privacy compliance, preserve measurement accuracy,
                  and maximize data collection while respecting user consent.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              High
            </span>

          </div>

        </div>

        {/* Recommendation 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-md">

          <div className="flex items-start justify-between gap-4">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <TriangleAlert className="h-5 w-5 text-slate-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Improve Data Layer
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Standardize events and parameters to improve reporting,
                  attribution, and long-term analytics reliability.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              Medium
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}