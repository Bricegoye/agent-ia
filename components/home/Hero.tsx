"use client";

import DashboardPreview from "./DashboardPreview";

import { useLanguage } from "@/lib/i18n/language-context";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-36 pb-28">

        {/* Hero Content */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
            ✨ {t.hero.badge}
          </span>

          {/* Title */}
          <h1 className="mt-11 text-6xl font-extrabold text-slate-900">
            {t.hero.title}
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            {t.hero.subtitle}
          </p>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
            {t.hero.description}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="rounded-xl bg-sky-600 px-8 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md">
              🚀 {t.hero.startAudit}
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md">
              📖 {t.hero.viewDemo}
            </button>
          </div>

        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 flex justify-center">
          <DashboardPreview />
        </div>

      </div>
    </section>
  );
}