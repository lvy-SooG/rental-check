"use client";

import { useI18n } from "@/lib/i18n/provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut } from "lucide-react";
import { signOutAction } from "./actions";

export function ProfileClient({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t.profile.title}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t.profile.accountInfo}</CardTitle>
            <CardDescription>{t.profile.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <form action={signOutAction}>
                <Button variant="destructive" type="submit">
                  <LogOut className="h-4 w-4" />
                  {t.profile.signOut}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
