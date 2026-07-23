"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: Home },
    { href: "/inspections", label: t.nav.inspections, icon: FileCheck },
    { href: "/profile", label: t.nav.profile, icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <FileCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {t.brand.name}
            <span className="text-blue-600">{t.brand.accent}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/inspections/new"
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <FileCheck className="h-4 w-4" />
            {t.nav.newInspection}
          </Link>
        </div>
      </div>
    </header>
  );
}
