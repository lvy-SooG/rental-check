export type Locale = "en" | "zh" | "ja" | "ko" | "ru";

export interface LocaleOption {
  value: Locale;
  label: string;
  flag: string;
}

export const LOCALES: LocaleOption[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
};
