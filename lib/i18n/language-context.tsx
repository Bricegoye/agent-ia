"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
} from "./translations";

/**
 * Le dictionnaire peut correspondre
 * à la version française OU anglaise.
 */
type TranslationDictionary =
  (typeof translations)[Language];

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] =
    useState<Language>("fr");

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}