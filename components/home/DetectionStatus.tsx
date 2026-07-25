import {
  BadgeCheck,
  CircleAlert,
} from "lucide-react";

export default function DetectionStatus() {
  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Detection Status
      </h3>

      <div className="space-y-4">

        {/* Google Analytics 4 */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-sky-300 hover:shadow-md">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Google Analytics 4
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Measurement detected
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Connected
          </span>

        </div>

        {/* GTM */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-sky-300 hover:shadow-md">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Google Tag Manager
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Container detected
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Connected
          </span>

        </div>

        {/* Consent Mode */}
        <div className="flex items-center justify-between rounded-2xl border border-yellow-200 bg-yellow-50 p-5 transition-all duration-300 hover:shadow-md">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
              <CircleAlert className="h-5 w-5 text-yellow-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Consent Mode
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Needs improvement
              </p>
            </div>

          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Warning
          </span>

        </div>

        {/* Meta Pixel */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-sky-300 hover:shadow-md">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Meta Pixel
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Active
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Connected
          </span>

        </div>

      </div>
    </div>
  );
}