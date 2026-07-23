"use client";

import Link from "next/link";
import { Plus, FileCheck, Calendar, Camera, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

export function DashboardClient({ userName }: { userName: string }) {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t.dashboard.welcome}, {userName?.split(" ")[0]} {t.dashboard.welcomeSuffix}
        </h1>
        <p className="mt-1 text-gray-600">
          {t.dashboard.welcomeMessage}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.dashboard.totalInspections}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.dashboard.reportsGenerated}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.dashboard.photosUploaded}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t.dashboard.quickActions}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/inspections/new">
            <Card className="h-full cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t.dashboard.newInspection}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.dashboard.newInspectionDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/inspections">
            <Card className="h-full cursor-pointer hover:border-gray-300 hover:shadow-md transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                  <FileCheck className="h-7 w-7 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t.dashboard.viewInspections}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.dashboard.viewInspectionsDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Inspections */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t.dashboard.recentInspections}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/inspections">{t.dashboard.viewAll}</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 font-medium text-gray-900">{t.dashboard.noInspections}</h3>
            <p className="mb-4 text-sm text-gray-500">
              {t.dashboard.noInspectionsDesc}
            </p>
            <Button asChild>
              <Link href="/inspections/new">
                <Plus className="h-4 w-4" />
                {t.dashboard.newInspection}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
