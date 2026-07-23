"use client";

import Link from "next/link";
import {
  Camera,
  Shield,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {t.nav.signIn}
            </Link>
            <Button asChild size="sm">
              <Link href="/login">{t.nav.getStarted}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Shield className="h-4 w-4" />
              {t.landing.badge}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              {t.landing.heroTitle}{" "}
              <span className="text-blue-600">{t.landing.heroTitleAccent}</span>{" "}
              {t.landing.heroTitleSuffix}
            </h1>
            <p className="mb-10 text-lg text-gray-600 md:text-xl">
              {t.landing.heroDescription}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">
                  {t.landing.startFreeInspection}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">{t.landing.seeHowItWorks}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {t.landing.featuresDescription}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Camera,
                title: t.landing.feature1Title,
                description: t.landing.feature1Desc,
              },
              {
                icon: Zap,
                title: t.landing.feature2Title,
                description: t.landing.feature2Desc,
              },
              {
                icon: FileText,
                title: t.landing.feature3Title,
                description: t.landing.feature3Desc,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {t.landing.howItWorksDesc}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: t.landing.step1Title,
                description: t.landing.step1Desc,
              },
              {
                step: "02",
                title: t.landing.step2Title,
                description: t.landing.step2Desc,
              },
              {
                step: "03",
                title: t.landing.step3Title,
                description: t.landing.step3Desc,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              {t.landing.benefitsTitle}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                t.landing.benefit1,
                t.landing.benefit2,
                t.landing.benefit3,
                t.landing.benefit4,
                t.landing.benefit5,
                t.landing.benefit6,
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t.landing.ctaTitle}
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            {t.landing.ctaDescription}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">
              {t.landing.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <FileCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">
                {t.brand.name}
                {t.brand.accent}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {t.landing.footerCopyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
