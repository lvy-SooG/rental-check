"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Camera,
  Download,
  FileText,
  Sofa,
  Bed,
  Utensils,
  Bath,
  Sun,
  DoorOpen,
  Archive,
  Sparkles,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getInspection,
  addRoom,
  addPhoto,
  updatePhoto,
  removePhoto,
  saveInspection,
  updateInspectionPhase,
  setMoveOutDate,
} from "@/lib/inspection-store";
import { ROOM_CATEGORIES, type InspectionPhase } from "@/lib/types";
import type { Inspection, Room, RoomPhoto, AiAnalysisResult } from "@/lib/types";
import { formatDate, getConditionColor } from "@/lib/utils";
import { toast } from "sonner";
import { InspectionPDF } from "@/components/InspectionPDF";
import { pdf } from "@react-pdf/renderer";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/provider";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sofa: Sofa,
  bed: Bed,
  utensils: Utensils,
  bath: Bath,
  sun: Sun,
  "door-open": DoorOpen,
  archive: Archive,
  plus: Plus,
};

export default function InspectionDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [analyzingPhoto, setAnalyzingPhoto] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState("");

  const id = params.id as string;

  useEffect(() => {
    const data = getInspection(id);
    if (data) {
      setInspection(data);
      setMoveOutDate(data.moveOutDate || "");
      if (data.rooms.length > 0) {
        setExpandedRooms(new Set([data.rooms[0].id]));
      }
    }
  }, [id]);

  const refreshData = () => {
    const data = getInspection(id);
    if (data) {
      setInspection(data);
    }
  };

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  const handleAddRoom = (categoryId: string, categoryName: string) => {
    if (!inspection) return;

    const room = addRoom(inspection.id, {
      name: categoryName,
      icon: categoryId,
    });

    setExpandedRooms((prev) => new Set([...prev, room.id]));
    setShowAddRoom(false);
    refreshData();
    toast.success(`${categoryName} added`);
  };

  const handleFileUpload = async (
    roomId: string,
    files: FileList | null,
    phase: InspectionPhase
  ) => {
    if (!inspection || !files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "pathname",
          `inspections/${inspection.id}/${roomId}/${phase}/${Date.now()}-${file.name}`
        );

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const blob = await res.json();

        addPhoto(inspection.id, roomId, {
          url: blob.url,
          name: file.name,
          category: roomId,
          uploadedAt: new Date(),
          phase,
        });
      }

      refreshData();
      toast.success(t.inspectionDetail.uploadSuccess);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(t.inspectionDetail.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzePhoto = async (roomId: string, photoId: string) => {
    if (!inspection) return;

    const room = inspection.rooms.find((r) => r.id === roomId);
    const photo = room?.photos.find((p) => p.id === photoId);
    if (!photo) return;

    setAnalyzingPhoto(photoId);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: photo.url,
          roomName: room?.name,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const result: AiAnalysisResult = await res.json();

      updatePhoto(inspection.id, roomId, photoId, {
        aiAnalysis: result.summary,
        items: result.items,
      });

      refreshData();
      toast.success(t.inspectionDetail.analysisComplete);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(t.inspectionDetail.analysisFailed);
    } finally {
      setAnalyzingPhoto(null);
    }
  };

  const handleRemovePhoto = (roomId: string, photoId: string) => {
    if (!inspection) return;
    if (confirm(t.inspectionDetail.removePhoto)) {
      removePhoto(inspection.id, roomId, photoId);
      refreshData();
      toast.success(t.inspectionDetail.photoRemoved);
    }
  };

  const handleRoomNotesChange = (roomId: string, notes: string) => {
    if (!inspection) return;
    const room = inspection.rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.notes = notes;
    inspection.updatedAt = new Date();
    saveInspection(inspection);
    setInspection({ ...inspection });
  };

  const handleExportPDF = async () => {
    if (!inspection) return;
    setGeneratingPDF(true);
    try {
      const blob = await pdf(
        <InspectionPDF inspection={inspection} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `move-in-inspection-${inspection.id
        .slice(0, 8)
        .toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t.inspectionDetail.pdfDownloaded);
    } catch (error) {
      console.error("PDF error:", error);
      toast.error(t.inspectionDetail.pdfFailed);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePhaseChange = (phase: InspectionPhase) => {
    if (!inspection) return;
    updateInspectionPhase(inspection.id, phase);
    refreshData();
    toast.success(phase === "move-in" ? t.inspectionDetail.switchedToMoveIn : t.inspectionDetail.switchedToMoveOut);
  };

  const handleMoveOutDateChange = (date: string) => {
    setMoveOutDate(date);
    if (inspection) {
      setMoveOutDate(inspection.id, date);
    }
  };

  if (!inspection) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">{t.inspectionDetail.loading}</p>
      </div>
    );
  }

  const totalPhotos = inspection.rooms.reduce(
    (sum, r) => sum + r.photos.length,
    0
  );

  const moveInPhotos = inspection.rooms.reduce(
    (sum, r) => sum + r.photos.filter((p) => p.phase === "move-in").length,
    0
  );

  const moveOutPhotos = inspection.rooms.reduce(
    (sum, r) => sum + r.photos.filter((p) => p.phase === "move-out").length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/inspections"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.inspectionDetail.backToInspections}
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {inspection.propertyAddress}
            </h1>
            <p className="mt-1 text-gray-600">
              {t.inspectionDetail.moveInDate}: {formatDate(inspection.moveInDate)}
              {inspection.moveOutDate && (
                <> · {t.inspectionDetail.moveOutDate}: {formatDate(inspection.moveOutDate)}</>
              )}
              · {inspection.rooms.length} {t.inspectionDetail.rooms} · {totalPhotos} {t.inspectionDetail.photos}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={inspection.status === "completed" ? "success" : "warning"}>
              {inspection.status === "completed" ? t.inspectionDetail.completed : t.inspectionDetail.draft}
            </Badge>
            <Badge variant={inspection.phase === "move-in" ? "default" : "secondary"}>
              {inspection.phase === "move-in" ? t.inspectionDetail.moveIn : t.inspectionDetail.moveOut}
            </Badge>
            <Button
              onClick={handleExportPDF}
              disabled={generatingPDF || totalPhotos === 0}
            >
              {generatingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t.inspectionDetail.exportPDF}
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">{t.inspectionDetail.propertyAddress}</p>
              <p className="font-medium text-gray-900">
                {inspection.propertyAddress}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.inspectionDetail.tenant}</p>
              <p className="font-medium text-gray-900">
                {inspection.tenantName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.inspectionDetail.moveInDateLabel}</p>
              <p className="font-medium text-gray-900">
                {formatDate(inspection.moveInDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.inspectionDetail.status}</p>
              <p className="font-medium text-gray-900 capitalize">
                {inspection.status}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2">
                <Button
                  variant={inspection.phase === "move-in" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePhaseChange("move-in")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {t.inspectionDetail.moveIn}
                </Button>
                <Button
                  variant={inspection.phase === "move-out" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePhaseChange("move-out")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t.inspectionDetail.moveOut}
                </Button>
              </div>
              {inspection.phase === "move-out" && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={moveOutDate}
                    onChange={(e) => handleMoveOutDateChange(e.target.value)}
                    className="w-48"
                    placeholder={t.inspectionDetail.moveOutDatePlaceholder}
                  />
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {inspection.phase === "move-in"
                ? t.inspectionDetail.moveInHint
                : t.inspectionDetail.moveOutHint}
            </p>
          </div>
        </CardContent>
      </div>

      <Tabs defaultValue="photos" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">
            <Camera className="h-4 w-4 mr-2" />
            {t.inspectionDetail.photosView} ({moveInPhotos} / {moveOutPhotos})
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <GitCompare className="h-4 w-4 mr-2" />
            {t.inspectionDetail.comparisonView}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t.inspectionDetail.roomsTitle}</h2>
            <Button onClick={() => setShowAddRoom(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              {t.inspectionDetail.addRoom}
            </Button>
          </div>

          {showAddRoom && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t.inspectionDetail.addRoom}</h3>
                    <button
                      onClick={() => setShowAddRoom(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {ROOM_CATEGORIES.map((category) => {
                      const Icon = iconMap[category.icon] || Plus;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleAddRoom(category.id, category.name)}
                          className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <Icon className="h-6 w-6 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {(t.rooms as any)[category.id] || category.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {inspection.rooms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <DoorOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-1 font-medium text-gray-900">{t.inspectionDetail.noRooms}</h3>
                <p className="mb-4 text-sm text-gray-500">
                  {t.inspectionDetail.noRoomsDesc}
                </p>
                <Button onClick={() => setShowAddRoom(true)}>
                  <Plus className="h-4 w-4" />
                  {t.inspectionDetail.addFirstRoom}
                </Button>
              </CardContent>
            </Card>
          ) : (
            inspection.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                expanded={expandedRooms.has(room.id)}
                onToggle={() => toggleRoom(room.id)}
                onFileUpload={(files) => handleFileUpload(room.id, files, inspection.phase)}
                onAnalyzePhoto={(photoId) =>
                  handleAnalyzePhoto(room.id, photoId)
                }
                onRemovePhoto={(photoId) => handleRemovePhoto(room.id, photoId)}
                onNotesChange={(notes) => handleRoomNotesChange(room.id, notes)}
                analyzingPhoto={analyzingPhoto}
                uploading={uploading}
                phase={inspection.phase}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonView inspection={inspection} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoomCard({
  room,
  expanded,
  onToggle,
  onFileUpload,
  onAnalyzePhoto,
  onRemovePhoto,
  onNotesChange,
  analyzingPhoto,
  uploading,
  phase,
}: {
  room: Room;
  expanded: boolean;
  onToggle: () => void;
  onFileUpload: (files: FileList | null) => void;
  onAnalyzePhoto: (photoId: string) => void;
  onRemovePhoto: (photoId: string) => void;
  onNotesChange: (notes: string) => void;
  analyzingPhoto: string | null;
  uploading: boolean;
  phase: InspectionPhase;
}) {
  const { t } = useI18n();
  const Icon = iconMap[room.icon] || Plus;

  const phasePhotos = room.photos.filter((p) => p.phase === phase);

  return (
    <Card>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {(t.rooms as any)[room.icon] || room.name}
            </h3>
            <p className="text-sm text-gray-500">
              {phasePhotos.length} {t.inspectionDetail.photos} ({phase === "move-in" ? t.inspectionDetail.moveIn : t.inspectionDetail.moveOut})
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4">
          <div className="mb-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Camera className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {uploading ? t.inspectionDetail.uploading : t.inspectionDetail.uploadPhotos}
                </p>
                <p className="text-xs text-gray-500">
                  {phase === "move-in" ? t.inspectionDetail.moveInUploadHint : t.inspectionDetail.moveOutUploadHint}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
                disabled={uploading}
              />
            </label>
          </div>

          {phasePhotos.length > 0 && (
            <div className="mb-4">
              <p className="mb-3 text-sm font-medium text-gray-700">
                {t.inspectionDetail.photosCount} ({phasePhotos.length})
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {phasePhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onAnalyze={() => onAnalyzePhoto(photo.id)}
                    onRemove={() => onRemovePhoto(photo.id)}
                    analyzing={analyzingPhoto === photo.id}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              {t.inspectionDetail.roomNotes}
            </p>
            <Textarea
              placeholder={t.inspectionDetail.roomNotesPlaceholder}
              defaultValue={room.notes || ""}
              onBlur={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function PhotoCard({
  photo,
  onAnalyze,
  onRemove,
  analyzing,
}: {
  photo: RoomPhoto;
  onAnalyze: () => void;
  onRemove: () => void;
  analyzing: boolean;
}) {
  const { t } = useI18n();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200">
        <div className="absolute top-1 left-1 z-10">
          <Badge className={cn("text-xs", photo.phase === "move-in" ? "bg-blue-500 text-white" : "bg-orange-500 text-white")}>
            {photo.phase === "move-in" ? t.inspectionDetail.moveIn : t.inspectionDetail.moveOut}
          </Badge>
        </div>
        <img
          src={photo.url}
          alt={photo.name}
          className="aspect-square w-full object-cover cursor-pointer"
          onClick={() => setShowDetail(true)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              disabled={analyzing}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-white/90 py-1 text-xs font-medium text-gray-700 hover:bg-white"
            >
              {analyzing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {analyzing ? t.inspectionDetail.analyzing : t.inspectionDetail.aiAnalyze}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex items-center justify-center rounded bg-red-500/90 p-1 text-white hover:bg-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        {photo.aiAnalysis && (
          <div className="absolute top-7 left-2">
            <Badge variant="success" className="text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              {t.inspectionDetail.analyzed}
            </Badge>
          </div>
        )}
      </div>

      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={cn(photo.phase === "move-in" ? "bg-blue-500 text-white" : "bg-orange-500 text-white")}>
                  {photo.phase === "move-in" ? t.inspectionDetail.moveIn : t.inspectionDetail.moveOut}
                </Badge>
                <h3 className="text-lg font-semibold">{photo.name}</h3>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <img
              src={photo.url}
              alt={photo.name}
              className="mb-4 w-full rounded-lg"
            />

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={onAnalyze}
                  disabled={analyzing}
                  size="sm"
                  variant="outline"
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {analyzing ? t.inspectionDetail.analyzing : t.inspectionDetail.runAIAnalysis}
                </Button>
              </div>

              {photo.aiAnalysis && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="mb-2 text-sm font-medium text-blue-900">
                    <Sparkles className="mr-1 inline h-4 w-4" />
                    {t.inspectionDetail.aiAnalysis}
                  </p>
                  <p className="text-sm text-blue-800">{photo.aiAnalysis}</p>
                </div>
              )}

              {photo.items && photo.items.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    {t.inspectionDetail.detectedItems}
                  </p>
                  <div className="space-y-2">
                    {photo.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          {item.location && (
                            <p className="text-xs text-gray-500">
                              {item.location}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-gray-500">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={getConditionColor(item.condition)}
                        >
                          {(t.conditions as any)[item.condition] || item.condition}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ComparisonView({ inspection }: { inspection: Inspection }) {
  const { t } = useI18n();

  const hasBothPhases = inspection.rooms.some(
    (r) =>
      r.photos.some((p) => p.phase === "move-in") &&
      r.photos.some((p) => p.phase === "move-out")
  );

  if (!hasBothPhases) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <GitCompare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-1 font-medium text-gray-900">
            {t.inspectionDetail.noComparisonData}
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            {t.inspectionDetail.noComparisonDataDesc}
          </p>
          <Button onClick={() => updateInspectionPhase(inspection.id, "move-out")}>
            <FileText className="h-4 w-4 mr-2" />
            {t.inspectionDetail.startMoveOut}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {inspection.rooms.map((room) => {
        const moveInPhotos = room.photos.filter((p) => p.phase === "move-in");
        const moveOutPhotos = room.photos.filter((p) => p.phase === "move-out");

        if (moveInPhotos.length === 0 || moveOutPhotos.length === 0) return null;

        const Icon = iconMap[room.icon] || Plus;

        return (
          <Card key={room.id}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">
                  {(t.rooms as any)[room.icon] || room.name}
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge className="bg-blue-500 text-white">{t.inspectionDetail.moveIn}</Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {moveInPhotos.length} {t.inspectionDetail.photos}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {moveInPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="aspect-square w-full object-cover"
                        />
                        {photo.aiAnalysis && (
                          <div className="absolute bottom-1 right-1">
                            <Badge variant="success" className="text-xs">
                              <Sparkles className="mr-1 h-3 w-3" />
                              {t.inspectionDetail.analyzed}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge className="bg-orange-500 text-white">{t.inspectionDetail.moveOut}</Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {moveOutPhotos.length} {t.inspectionDetail.photos}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {moveOutPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="aspect-square w-full object-cover"
                        />
                        {photo.aiAnalysis && (
                          <div className="absolute bottom-1 right-1">
                            <Badge variant="success" className="text-xs">
                              <Sparkles className="mr-1 h-3 w-3" />
                              {t.inspectionDetail.analyzed}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  {t.inspectionDetail.aiAnalysis}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="mb-2 text-xs font-medium text-blue-900">
                      {t.inspectionDetail.moveIn} {t.inspectionDetail.analysis}
                    </p>
                    <p className="text-sm text-blue-800">
                      {moveInPhotos.find((p) => p.aiAnalysis)?.aiAnalysis ||
                        t.inspectionDetail.noAnalysisYet}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <p className="mb-2 text-xs font-medium text-orange-900">
                      {t.inspectionDetail.moveOut} {t.inspectionDetail.analysis}
                    </p>
                    <p className="text-sm text-orange-800">
                      {moveOutPhotos.find((p) => p.aiAnalysis)?.aiAnalysis ||
                        t.inspectionDetail.noAnalysisYet}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
