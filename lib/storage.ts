import { BabyInfo, AssessmentResult } from './types';

const STORAGE_KEY = 'baby_assessment_data';

// Save assessment data to localStorage
export const saveAssessment = (babyInfo: BabyInfo, result: AssessmentResult): void => {
  try {
    const existingDataStr = localStorage.getItem(STORAGE_KEY);
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    const newEntry = {
      babyInfo,
      result,
      date: new Date().toISOString()
    };
    
    // Keep only the last 5 entries
    const updatedData = [newEntry, ...existingData].slice(0, 5);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get the last assessment from localStorage
export const getLastAssessment = () => {
  try {
    const existingDataStr = localStorage.getItem(STORAGE_KEY);
    if (!existingDataStr) return null;
    
    const existingData = JSON.parse(existingDataStr);
    return existingData.length > 0 ? existingData[0] : null;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

// Clear all saved assessments
export const clearAssessments = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};