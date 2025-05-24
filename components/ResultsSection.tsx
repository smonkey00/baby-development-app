"use client";

import { useState, useEffect } from "react";
import { Baby, AnalysisResult } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Clock, Zap } from "lucide-react";
import HeightAnalysis from "@/components/HeightAnalysis";
import WeightAnalysis from "@/components/WeightAnalysis";
import RecommendationSection from "@/components/RecommendationSection";
import { analyzeData } from "@/lib/analysis";
import { getRecommendation } from "@/lib/api";
import { motion } from "@/lib/motion";

interface ResultsSectionProps {
  baby: Baby;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onBack: () => void;
}

export default function ResultsSection({ 
  baby, 
  loading,
  setLoading,
  onBack 
}: ResultsSectionProps) {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("正在分析宝宝发育数据...");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: 本地分析
        setLoadingStep("正在分析身高体重数据...");
        const analysis = analyzeData(baby);
        
        // Step 2: AI 建议
        setLoadingStep("正在生成个性化建议...");
        const recommendation = await getRecommendation(
          baby, 
          analysis.heightAnalysis.assessment, 
          analysis.weightAnalysis.assessment
        );
        
        setLoadingStep("分析完成！");
        setResults({
          ...analysis,
          recommendation
        });
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("获取分析结果时出错，请稍后再试。");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [baby, setLoading]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        
        {!loading && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重新测试
          </Button>
        )}
      </div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-6 w-6 text-pink-500 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">{loadingStep}</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              预计需要 10-15 秒
            </div>
          </div>
          
          {/* 进度提示 */}
          <div className="mt-6 w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: loadingStep.includes("身高体重") ? "30%" : 
                       loadingStep.includes("个性化建议") ? "70%" : 
                       loadingStep.includes("完成") ? "100%" : "10%" 
              }}
            ></div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">分析遇到问题</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <div className="space-x-3">
            <Button onClick={onBack} variant="outline">返回重试</Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-pink-500 hover:bg-pink-600"
            >
              刷新页面
            </Button>
          </div>
        </motion.div>
      ) : results ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <HeightAnalysis analysis={results.heightAnalysis} />
          <WeightAnalysis analysis={results.weightAnalysis} />
          <RecommendationSection recommendation={results.recommendation} />
        </motion.div>
      ) : null}
    </div>
  );
}