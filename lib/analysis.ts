import { Baby, Assessment, HeightAnalysis, WeightAnalysis, AnalysisResult } from "@/types";
import { babyData } from "@/lib/averageData";

export function analyzeData(baby: Baby): Omit<AnalysisResult, "recommendation"> {
  const { age, height, weight, gender } = baby;
  
  // Get average data for the age and gender
  const averageData = babyData.find(
    (data) => data.ageMonths === age && data.gender === gender
  );
  
  if (!averageData) {
    throw new Error(`No average data found for age ${age} months and gender ${gender}`);
  }
  
  const heightAnalysis = analyzeHeight(height, averageData.avgHeight);
  const weightAnalysis = analyzeWeight(weight, averageData.avgWeight);
  
  return {
    heightAnalysis,
    weightAnalysis
  };
}

function analyzeHeight(height: number, avgHeight: number): HeightAnalysis {
  const heightRatio = height / avgHeight;
  let assessment: Assessment;
  
  if (heightRatio > 1.15) {
    assessment = "偏高";
  } else if (heightRatio > 1.05) {
    assessment = "稍微偏高";
  } else if (heightRatio >= 0.95) {
    assessment = "中等";
  } else if (heightRatio >= 0.85) {
    assessment = "稍微偏低";
  } else {
    assessment = "偏低";
  }
  
  return {
    inputHeight: height,
    averageHeight: avgHeight,
    assessment
  };
}

function analyzeWeight(weight: number, avgWeight: number): WeightAnalysis {
  const weightRatio = weight / avgWeight;
  let assessment: Assessment;
  
  if (weightRatio > 1.20) {
    assessment = "偏重";
  } else if (weightRatio > 1.10) {
    assessment = "稍微偏重";
  } else if (weightRatio >= 0.90) {
    assessment = "中等";
  } else if (weightRatio >= 0.80) {
    assessment = "稍微偏轻";
  } else {
    assessment = "偏轻";
  }
  
  return {
    inputWeight: weight,
    averageWeight: avgWeight,
    assessment
  };
}