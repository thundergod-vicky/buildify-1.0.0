import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  // If it's an S3 key (starts with 'uploads/'), route it through our backend stream endpoint
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${baseUrl}/content/stream/${cleanUrl}`;
}
