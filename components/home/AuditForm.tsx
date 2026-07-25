"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import type { AuditResult } from "@/lib/types/audit-result";
import { useLanguage } from "@/lib/i18n/language-context";

import AuditResults from "./AuditResults";

export default function AuditForm() {
  const { t, language } = useLanguage();

  const [input, setInput] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  async function generate() {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: input,
          language,
        }),
      });

      const data: AuditResult = await res.json();

      setResult(data);
    } catch {
      setResult({
        success: false,
        url: input,
        error: t.audit.failed,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-slate-50 py-28">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            {t.audit.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.audit.title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t.audit.description}
          </p>
        </div>

        {/* Audit Form */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    generate();
                  }
                }}
                placeholder="https://example.com"
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <button
                onClick={generate}
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-4 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t.audit.analyzing}
                  </>
                ) : (
                  <>
                    {t.audit.analyze}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

            </div>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            {t.audit.helper}
          </p>

          {/* Loading State */}
          {loading && (
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

                {/* Progress bar */}
                <div className="h-1 overflow-hidden bg-slate-100">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-sky-500" />
                </div>

                <div className="p-8">

                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                      <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {t.audit.loadingTitle}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {t.audit.loadingDescription}
                      </p>
                    </div>
                  </div>

                  {/* Analysis Steps */}
                  <div className="mt-8 space-y-4">

                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        ✓
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {t.audit.connecting}
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-sky-500" />

                      <span className="text-sm font-medium text-slate-700">
                        {t.audit.detecting}
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200" />

                      <span className="text-sm text-slate-400">
                        {t.audit.evaluating}
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200" />

                      <span className="text-sm text-slate-400">
                        {t.audit.generating}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Audit Result */}
        {result && (
          <div ref={resultRef} className="scroll-mt-24">
            {result.success ? (
              <AuditResults result={result} />
            ) : (
              <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-semibold text-red-700">
                  {t.audit.failed}
                </p>

                <p className="mt-2 text-sm text-red-600">
                  {result.error}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}