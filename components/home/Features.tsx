"use client";

import {
  Search,
  Gauge,
  ShieldCheck,
  Database,
  Sparkles,
  ListChecks,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/language-context";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: t.features.detectionTitle,
      description: t.features.detectionDescription,
    },
    {
      icon: Gauge,
      title: t.features.scoringTitle,
      description: t.features.scoringDescription,
    },
    {
      icon: ShieldCheck,
      title: t.features.consentTitle,
      description: t.features.consentDescription,
    },
    {
      icon: Database,
      title: t.features.dataQualityTitle,
      description: t.features.dataQualityDescription,
    },
    {
      icon: Sparkles,
      title: t.features.aiInsightsTitle,
      description: t.features.aiInsightsDescription,
    },
    {
      icon: ListChecks,
      title: t.features.recommendationsTitle,
      description: t.features.recommendationsDescription,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 bg-slate-50 py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            {t.features.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.features.title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t.features.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                  <Icon className="h-6 w-6 text-sky-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}