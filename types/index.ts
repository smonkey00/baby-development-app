export type Baby = {
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female";
};

export type Assessment = "偏高" | "稍微偏高" | "中等" | "稍微偏低" | "偏低" | "偏重" | "稍微偏重" | "稍微偏轻" | "偏轻";

export type HeightAnalysis = {
  inputHeight: number;
  averageHeight: number;
  assessment: Assessment;
};

export type WeightAnalysis = {
  inputWeight: number;
  averageWeight: number;
  assessment: Assessment;
};

export type Recommendation = {
  diet: string;
  exercise: string;
  lifestyle: string;
};

export type AnalysisResult = {
  heightAnalysis: HeightAnalysis;
  weightAnalysis: WeightAnalysis;
  recommendation: Recommendation;
};