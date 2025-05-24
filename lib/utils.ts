import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Assessment } from "@/types";
import { 
  ArrowUpCircle, 
  ArrowUp, 
  CircleDot, 
  ArrowDown, 
  ArrowDownCircle,
  type LucideIcon
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssessmentColor(assessment: Assessment): { bg: string; text: string; bar: string } {
  switch (assessment) {
    case "偏高":
      return { 
        bg: "bg-blue-100", 
        text: "text-blue-700",
        bar: "bg-blue-600"
      };
    case "稍微偏高":
      return { 
        bg: "bg-blue-50", 
        text: "text-blue-500",
        bar: "bg-blue-400"
      };
    case "中等":
      return { 
        bg: "bg-green-100", 
        text: "text-green-600",
        bar: "bg-green-500"
      };
    case "稍微偏低":
      return { 
        bg: "bg-amber-50", 
        text: "text-amber-500",
        bar: "bg-amber-400"
      };
    case "偏低":
      return { 
        bg: "bg-amber-100", 
        text: "text-amber-700",
        bar: "bg-amber-600"
      };
    case "偏重":
      return { 
        bg: "bg-red-100", 
        text: "text-red-700",
        bar: "bg-red-600"
      };
    case "稍微偏重":
      return { 
        bg: "bg-red-50", 
        text: "text-red-500",
        bar: "bg-red-400"
      };
    case "稍微偏轻":
      return { 
        bg: "bg-purple-50", 
        text: "text-purple-500",
        bar: "bg-purple-400"
      };
    case "偏轻":
      return { 
        bg: "bg-purple-100", 
        text: "text-purple-700",
        bar: "bg-purple-600"
      };
    default:
      return { 
        bg: "bg-gray-100", 
        text: "text-gray-600",
        bar: "bg-gray-500"
      };
  }
}

export function getAssessmentIcon(assessment: Assessment): LucideIcon {
  switch (assessment) {
    case "偏高":
    case "偏重":
      return ArrowUpCircle;
    case "稍微偏高":
    case "稍微偏重":
      return ArrowUp;
    case "中等":
      return CircleDot;
    case "稍微偏低":
    case "稍微偏轻":
      return ArrowDown;
    case "偏低":
    case "偏轻":
      return ArrowDownCircle;
    default:
      return CircleDot;
  }
}