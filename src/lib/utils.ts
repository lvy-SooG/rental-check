import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case "good":
      return "text-green-600 bg-green-50";
    case "fair":
      return "text-yellow-600 bg-yellow-50";
    case "poor":
      return "text-orange-600 bg-orange-50";
    case "damaged":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getConditionLabel(condition: string): string {
  switch (condition) {
    case "good":
      return "Good";
    case "fair":
      return "Fair";
    case "poor":
      return "Poor";
    case "damaged":
      return "Damaged";
    default:
      return "Unknown";
  }
}
