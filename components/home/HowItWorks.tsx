"use client";

import { Link2, ScanSearch, FileCheck2 } from "lucide-react";

import { useLanguage } from "@/lib/i18n/language-context";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: Link2,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Description,
    },
    {
      number: "02",
      icon: ScanSearch,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Description,
    },
    {
      number: "03",
      icon: FileCheck2,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Description,
    },
  ];

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            {t.howItWorks.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.howItWorks.title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t.howItWorks.description}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center"
              >

                {/* Step Number */}
                <span className="text-sm font-bold text-sky-600">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
                  <Icon className="h-7 w-7 text-sky-600" />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
                  {step.description}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}