"use client";

import type { Inspection, Room, RoomPhoto } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "rental-inspections";

export function getInspections(): Inspection[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getInspection(id: string): Inspection | undefined {
  const inspections = getInspections();
  return inspections.find((i) => i.id === id);
}

export function saveInspection(inspection: Inspection): void {
  const inspections = getInspections();
  const index = inspections.findIndex((i) => i.id === inspection.id);
  if (index >= 0) {
    inspections[index] = inspection;
  } else {
    inspections.unshift(inspection);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
}

export function deleteInspection(id: string): void {
  const inspections = getInspections();
  const filtered = inspections.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function createInspection(data: {
  propertyAddress: string;
  moveInDate: string;
  landlordName?: string;
  tenantName: string;
  tenantEmail: string;
}): Inspection {
  const now = new Date();
  const inspection: Inspection = {
    id: generateId(),
    propertyAddress: data.propertyAddress,
    moveInDate: data.moveInDate,
    landlordName: data.landlordName,
    tenantName: data.tenantName,
    tenantEmail: data.tenantEmail,
    rooms: [],
    createdAt: now,
    updatedAt: now,
    status: "draft",
    phase: "move-in",
  };
  saveInspection(inspection);
  return inspection;
}

export function addRoom(inspectionId: string, room: Omit<Room, "id" | "photos">): Room {
  const inspection = getInspection(inspectionId);
  if (!inspection) throw new Error("Inspection not found");

  const newRoom: Room = {
    ...room,
    id: generateId(),
    photos: [],
  };

  inspection.rooms.push(newRoom);
  inspection.updatedAt = new Date();
  saveInspection(inspection);
  return newRoom;
}

export function addPhoto(inspectionId: string, roomId: string, photo: Omit<RoomPhoto, "id">, phase?: "move-in" | "move-out"): RoomPhoto {
  const inspection = getInspection(inspectionId);
  if (!inspection) throw new Error("Inspection not found");

  const room = inspection.rooms.find((r) => r.id === roomId);
  if (!room) throw new Error("Room not found");

  const newPhoto: RoomPhoto = {
    ...photo,
    id: generateId(),
    phase: phase || inspection.phase || "move-in",
  };

  room.photos.push(newPhoto);
  inspection.updatedAt = new Date();
  saveInspection(inspection);
  return newPhoto;
}

export function updateInspectionPhase(inspectionId: string, phase: "move-in" | "move-out"): void {
  const inspection = getInspection(inspectionId);
  if (!inspection) return;

  inspection.phase = phase;
  inspection.updatedAt = new Date();
  saveInspection(inspection);
}

export function setMoveOutDate(inspectionId: string, moveOutDate: string): void {
  const inspection = getInspection(inspectionId);
  if (!inspection) return;

  inspection.moveOutDate = moveOutDate;
  inspection.updatedAt = new Date();
  saveInspection(inspection);
}

export function updatePhoto(
  inspectionId: string,
  roomId: string,
  photoId: string,
  updates: Partial<RoomPhoto>
): void {
  const inspection = getInspection(inspectionId);
  if (!inspection) return;

  const room = inspection.rooms.find((r) => r.id === roomId);
  if (!room) return;

  const photo = room.photos.find((p) => p.id === photoId);
  if (!photo) return;

  Object.assign(photo, updates);
  inspection.updatedAt = new Date();
  saveInspection(inspection);
}

export function removePhoto(inspectionId: string, roomId: string, photoId: string): void {
  const inspection = getInspection(inspectionId);
  if (!inspection) return;

  const room = inspection.rooms.find((r) => r.id === roomId);
  if (!room) return;

  room.photos = room.photos.filter((p) => p.id !== photoId);
  inspection.updatedAt = new Date();
  saveInspection(inspection);
}
