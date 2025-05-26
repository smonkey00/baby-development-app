"use client";

import React, { useState, useEffect } from 'react';

interface BabyLoadingProps {
  message?: string;
}

export default function BabyLoading({ message = "正在分析宝宝的成长数据..." }: BabyLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { emoji: "👶", text: "收集宝宝信息" },
    { emoji: "📊", text: "对比WHO标准" },
    { emoji: "🤖", text: "AI智能分析" },
    { emoji: "📝", text: "生成专属建议" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce">
          {steps[currentStep].emoji}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {steps[currentStep].text}
        </h3>
        <p className="text-sm text-gray-600">
          {message}
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* 闪光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex justify-center space-x-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 scale-125'
                : index < currentStep
                ? 'bg-gray-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* 可爱的装饰 */}
      <div className="flex justify-center mt-6 space-x-4 text-2xl opacity-60">
        <span className="animate-pulse">🍼</span>
        <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🧸</span>
        <span className="animate-pulse" style={{ animationDelay: '1s' }}>🎈</span>
      </div>
    </div>
  );
} 