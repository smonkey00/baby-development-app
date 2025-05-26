export interface BabyInfo {
  name: string; // 宝宝姓名或昵称
  age: number | ''; // in months
  height: number | ''; // in cm
  weight: number | ''; // in kg
  gender: 'male' | 'female';
}

export interface AssessmentResult {
  score: number;
  heightStatus: AssessmentStatus;
  weightStatus: AssessmentStatus;
  suggestion: string;
  nutritionAdvice?: string;
  exerciseAdvice?: string;
  sleepAdvice?: string;
}

export type AssessmentStatus = 'high' | 'slightly-high' | 'normal' | 'slightly-low' | 'low';

export interface ScoreLevel {
  level: string;
  emoji: string;
  color: string;
  description: string;
}

export interface AdviceModule {
  title: string;
  icon: string;
  content: string;
  loading: boolean;
}