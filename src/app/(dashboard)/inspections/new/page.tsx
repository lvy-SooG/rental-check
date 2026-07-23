"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, User, Mail, Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createInspection } from "@/lib/inspection-store";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function NewInspectionPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: "",
    moveInDate: new Date().toISOString().split("T")[0],
    landlordName: "",
    tenantName: "",
    tenantEmail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inspection = createInspection({
        propertyAddress: formData.propertyAddress,
        moveInDate: formData.moveInDate,
        landlordName: formData.landlordName || undefined,
        tenantName: formData.tenantName,
        tenantEmail: formData.tenantEmail,
      });

      toast.success(t.newInspection.createdSuccess);
      router.push(`/inspections/${inspection.id}`);
    } catch (error) {
      toast.error(t.newInspection.createFailed);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/inspections"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.newInspection.backToInspections}
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t.newInspection.title}</CardTitle>
            <CardDescription>
              {t.newInspection.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">
                <MapPin className="mr-2 inline h-4 w-4" />
                {t.newInspection.propertyAddress}
                </Label>
                <Input
                  id="propertyAddress"
                  placeholder={t.newInspection.propertyAddressPlaceholder}
                  value={formData.propertyAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyAddress: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moveInDate">
                <Calendar className="mr-2 inline h-4 w-4" />
                {t.newInspection.moveInDate}
                </Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) =>
                    setFormData({ ...formData, moveInDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">
                    <User className="mr-2 inline h-4 w-4" />
                    {t.newInspection.yourName}
                  </Label>
                  <Input
                    id="tenantName"
                    placeholder={t.newInspection.yourNamePlaceholder}
                    value={formData.tenantName}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenantEmail">
                    <Mail className="mr-2 inline h-4 w-4" />
                    {t.newInspection.yourEmail}
                  </Label>
                  <Input
                    id="tenantEmail"
                    type="email"
                    placeholder={t.newInspection.yourEmailPlaceholder}
                    value={formData.tenantEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantEmail: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordName">
                  <Building className="mr-2 inline h-4 w-4" />
                  {t.newInspection.landlordName}
                </Label>
                <Input
                  id="landlordName"
                  placeholder={t.newInspection.landlordPlaceholder}
                  value={formData.landlordName}
                  onChange={(e) =>
                    setFormData({ ...formData, landlordName: e.target.value })
                  }
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.newInspection.create : t.newInspection.createButton}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
