export type InspectionPhase = "move-in" | "move-out";

export interface RoomPhoto {
  id: string;
  url: string;
  name: string;
  category: string;
  phase: InspectionPhase;
  aiAnalysis?: string;
  items?: DetectedItem[];
  uploadedAt: Date;
}

export interface DetectedItem {
  name: string;
  condition: "good" | "fair" | "poor" | "damaged";
  notes?: string;
  location?: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  photos: RoomPhoto[];
  notes?: string;
}

export interface Inspection {
  id: string;
  propertyAddress: string;
  moveInDate: string;
  moveOutDate?: string;
  landlordName?: string;
  tenantName: string;
  tenantEmail: string;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "completed";
  phase: InspectionPhase;
}

export type RoomCategory =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "balcony"
  | "hallway"
  | "storage"
  | "other";

export const ROOM_CATEGORIES: { id: RoomCategory; name: string; icon: string }[] = [
  { id: "living-room", name: "Living Room", icon: "sofa" },
  { id: "bedroom", name: "Bedroom", icon: "bed" },
  { id: "kitchen", name: "Kitchen", icon: "utensils" },
  { id: "bathroom", name: "Bathroom", icon: "bath" },
  { id: "balcony", name: "Balcony", icon: "sun" },
  { id: "hallway", name: "Hallway", icon: "door-open" },
  { id: "storage", name: "Storage", icon: "archive" },
  { id: "other", name: "Other", icon: "plus" },
];

export interface AiAnalysisResult {
  summary: string;
  items: DetectedItem[];
  damageFound: boolean;
  overallCondition: "good" | "fair" | "poor";
}
