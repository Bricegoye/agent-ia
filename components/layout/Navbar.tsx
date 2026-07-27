"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { useLanguage } from "@/lib/i18n/language-context";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Main Navbar */}
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-3"
            aria-label="AIP - Home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#06152B] font-bold text-white">
              A
            </div>

            <div className="hidden flex-col justify-center sm:flex">
              <span className="text-lg font-bold leading-none text-slate-900">
                AIP
              </span>

              <span className="mt-1 text-xs leading-tight text-slate-500">
                Analytics Intelligence Platform
              </span>
            </div>

            {/* Mobile Brand */}
            <span className="text-lg font-bold text-slate-900 sm:hidden">
              AIP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">

            {/* Features */}
            <a
              href="/#features"
              className="text-sm font-medium text-slate-600 transition hover:text-sky-600"
            >
              {t.nav.features}
            </a>

            {/* How It Works */}
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-sky-600"
            >
              {t.nav.howItWorks}
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

            {/* Start Audit CTA */}
            <Link
              href="/audit"
              className="rounded-lg bg-[#06152B] px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {t.nav.startAudit}
            </Link>

          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">

            {/* Mobile Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                  language === "fr"
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                FR
              </button>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                  language === "en"
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <nav className="flex flex-col gap-2">

              {/* Features */}
              <a
                href="/#features"
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-sky-600"
              >
                {t.nav.features}
              </a>

              {/* How It Works */}
              <a
                href="/#how-it-works"
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-sky-600"
              >
                {t.nav.howItWorks}
              </a>

              {/* Start Audit */}
              <Link
                href="/audit"
                onClick={closeMobileMenu}
                className="mt-2 flex items-center justify-center rounded-lg bg-[#06152B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t.nav.startAudit}
              </Link>

            </nav>
          </div>
        )}

      </div>
    </header>
  );
}