"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#06152B] font-bold text-white">
            A
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold leading-none text-slate-900">
              AIP
            </h1>

            <p className="mt-1 text-xs leading-tight text-slate-500">
              Analytics Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-slate-600 transition hover:text-sky-500"
          >
            Documentation
          </a>

          <a
            href="#"
            className="text-sm text-slate-600 transition hover:text-sky-500"
          >
            GitHub
          </a>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                language === "fr"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              FR
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                language === "en"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              EN
            </button>
          </div>

          <button className="rounded-lg bg-[#06152B] px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Login
          </button>
        </nav>

      </div>
    </header>
  );
}