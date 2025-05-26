"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import InputForm from '@/components/input-form';
import ResultsSection from '@/components/results';
import BabyLoading from '@/components/ui/baby-loading';
import { BabyInfo, AssessmentResult } from '@/lib/types';
import { generateAssessment } from '@/lib/assessment';
import { saveAssessment, getLastAssessment } from '@/lib/storage';

export default function Home() {
  const [babyInfo, setBabyInfo] = useState<BabyInfo | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [previousData, setPreviousData] = useState<{ babyInfo: BabyInfo, result: AssessmentResult } | null>(null);

  useEffect(() => {
    // Get previous data from localStorage
    const lastAssessment = getLastAssessment();
    if (lastAssessment) {
      setPreviousData({
        babyInfo: lastAssessment.babyInfo,
        result: lastAssessment.result
      });
    }
  }, []);

  const handleSubmit = async (data: BabyInfo) => {
    setBabyInfo(data);
    setShowResults(true);
    setLoading(true);
    
    try {
      // Wait for assessment to complete
      const assessmentResult = await generateAssessment(data);
      setResult(assessmentResult);
      
      // Save to localStorage
      saveAssessment(data, assessmentResult);
    } catch (error) {
      console.error('Error generating assessment:', error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowResults(false);
    setBabyInfo(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF6FB] to-[#F3F6FF] px-4 py-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        {!showResults && <Header />}
        
        <div className="mt-8">
          {showResults ? (
            loading ? (
              <BabyLoading message={`正在为${babyInfo?.name}生成专属成长报告...`} />
            ) : (
              <ResultsSection 
                result={result!} 
                babyInfo={babyInfo!} 
                onReset={handleReset} 
              />
            )
          ) : (
            <InputForm 
              onSubmit={handleSubmit} 
              loading={false}
              initialData={previousData?.babyInfo}
            />
          )}
        </div>
      </div>
    </main>
  );
}