"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current = LOCALES.find((l) => l.value === locale) || LOCALES[0];

  const handleLocaleChange = useCallback((newLocale: typeof locale) => {
    setLocale(newLocale);
    setOpen(false);
  }, [setLocale]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        onClick={toggleOpen}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200 active:bg-gray-300 transition-colors select-none cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        {current.flag}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => handleLocaleChange(l.value)}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2 text-sm hover:bg-gray-50 transition-colors",
                locale === l.value ? "text-blue-600 font-medium" : "text-gray-700"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                {l.label}
              </span>
              {locale === l.value && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
