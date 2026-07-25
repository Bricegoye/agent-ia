export default function CategoryScores() {
  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Category Scores
      </h3>

      <div className="space-y-6">

        {/* Analytics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Analytics
            </span>

            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700">
              95
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-200">
            <div className="h-2.5 w-[95%] rounded-full bg-sky-600"></div>
          </div>
        </div>

        {/* Consent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Consent
            </span>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
              72
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-200">
            <div className="h-2.5 w-[72%] rounded-full bg-yellow-500"></div>
          </div>
        </div>

        {/* Marketing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Marketing
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
              88
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-200">
            <div className="h-2.5 w-[88%] rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Data Quality */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Data Quality
            </span>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
              90
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-200">
            <div className="h-2.5 w-[90%] rounded-full bg-indigo-500"></div>
          </div>
        </div>

      </div>
    </div>
  );
}