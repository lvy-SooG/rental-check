"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Locale, DEFAULT_LOCALE, LOCALES } from "./config";
import { dict as enDict } from "./locales/en";
import { dict as zhDict } from "./locales/zh";
import { dict as jaDict } from "./locales/ja";
import { dict as koDict } from "./locales/ko";
import { dict as ruDict } from "./locales/ru";

// Use a deeply typed structure based on en, but with widened string types
type DeepWiden<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepWiden<T[K]>;
};

type Dict = DeepWiden<typeof enDict>;

const dictionaries: Record<Locale, Dict> = {
  en: enDict as Dict,
  zh: zhDict as unknown as Dict,
  ja: jaDict as unknown as Dict,
  ko: koDict as unknown as Dict,
  ru: ruDict as unknown as Dict,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: enDict as Dict,
});

const STORAGE_KEY = "rentalcheck-locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some((l) => l.value === saved)) {
        setLocaleState(saved);
        return;
      }
    } catch {
      // localStorage may not be available in some environments (e.g. sandboxed iframe)
    }
    try {
      const browserLang = navigator.language.split("-")[0];
      const match = LOCALES.find((l) => l.value === browserLang);
      if (match) {
        setLocaleState(match.value);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage may not be available in some environments
    }
    document.documentElement.lang = newLocale;
  }, []);

  const displayLocale = isHydrated ? locale : DEFAULT_LOCALE;
  const value: I18nContextValue = {
    locale: displayLocale,
    setLocale,
    t: dictionaries[displayLocale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  return ctx;
}
