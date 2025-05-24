"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import BabyForm from "@/components/BabyForm";
import ResultsSection from "@/components/ResultsSection";
import { Baby } from "@/types";

export default function Home() {
  const [baby, setBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("babyData");
    if (savedData) {
      setBaby(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = (data: Baby) => {
    // Save to localStorage
    localStorage.setItem("babyData", JSON.stringify(data));
    setBaby(data);
    setShowResults(true);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 flex flex-col items-center py-8 px-4">
        <div className="max-w-xl w-full mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
              宝宝发育早知道
            </h1>
            <p className="text-gray-500 text-sm">
              不同个体存在差异，数据仅供参考
            </p>
          </header>

          {!showResults ? (
            <BabyForm 
              onSubmit={handleSubmit} 
              initialData={baby} 
              loading={loading} 
            />
          ) : (
            <ResultsSection 
              baby={baby!} 
              loading={loading}
              setLoading={setLoading}
              onBack={() => setShowResults(false)} 
            />
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}