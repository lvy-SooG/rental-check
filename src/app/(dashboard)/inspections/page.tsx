"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, MapPin, FileDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInspections, deleteInspection } from "@/lib/inspection-store";
import type { Inspection } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/provider";

export default function InspectionsPage() {
  const { t } = useI18n();
  const [inspections, setInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    setInspections(getInspections());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(t.inspections.deleteConfirm)) {
      deleteInspection(id);
      setInspections(getInspections());
      toast.success(t.inspections.deleted);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.inspections.title}</h1>
          <p className="mt-1 text-gray-600">
            {t.inspections.description}
          </p>
        </div>
        <Button asChild>
          <Link href="/inspections/new">
            <Plus className="h-4 w-4" />
            {t.inspections.newInspection}
          </Link>
        </Button>
      </div>

      {inspections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FileDown className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 font-medium text-gray-900">
              {t.inspections.noInspections}
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              {t.inspections.noInspectionsDesc}
            </p>
            <Button asChild>
              <Link href="/inspections/new">
                <Plus className="h-4 w-4" />
                {t.inspections.newInspection}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inspections.map((inspection) => (
            <Link
              key={inspection.id}
              href={`/inspections/${inspection.id}`}
              className="block"
            >
              <Card className="h-full cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge
                      variant={
                        inspection.status === "completed"
                          ? "success"
                          : "warning"
                      }
                    >
                      {inspection.status === "completed"
                        ? t.inspections.completed
                        : t.inspections.draft}
                    </Badge>
                    <button
                      onClick={(e) => handleDelete(inspection.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium line-clamp-1">
                      {inspection.propertyAddress}
                    </span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{t.inspections.moveIn}: {formatDate(inspection.moveInDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{inspection.rooms.length} {t.inspections.rooms}</span>
                    <span>
                      {inspection.rooms.reduce(
                        (sum, r) => sum + r.photos.length,
                        0
                      )}{" "}
                      {t.inspections.photos}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
