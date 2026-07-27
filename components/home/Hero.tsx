"use client";

import Link from "next/link";
import DashboardPreview from "./DashboardPreview";

import { useLanguage } from "@/lib/i18n/language-context";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-36">

        {/* Hero Content */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <span className="inline-flex max-w-full items-center justify-center rounded-full bg-sky-100 px-3 py-2 text-xs font-medium text-sky-700 sm:px-4 sm:text-sm">
            ✨ {t.hero.badge}
          </span>

          {/* Title */}
          <h1 className="mt-8 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:mt-10 sm:text-5xl lg:mt-11 lg:text-6xl">
            {t.hero.title}
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {t.hero.subtitle}
          </p>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:mt-6 sm:text-lg sm:leading-8">
            {t.hero.description}
          </p>

          {/* CTA */}
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">

            {/* Start Audit */}
            <Link
              href="/audit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md sm:w-auto sm:px-8"
            >
              🚀 {t.hero.startAudit}
            </Link>

            {/* View Demo */}
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md sm:w-auto sm:px-8"
            >
              📖 {t.hero.viewDemo}
            </a>

          </div>
        </div>

        {/* Dashboard Preview */}
        <div
          id="demo"
          className="mt-14 flex w-full scroll-mt-28 justify-center sm:mt-16 lg:mt-20"
        >
          <div className="w-full min-w-0">
            <DashboardPreview />
          </div>
        </div>

      </div>
    </section>
  );
}