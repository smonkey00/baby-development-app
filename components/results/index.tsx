"use client";

import React, { useState, useEffect } from 'react';
import ScoreCard from './score-card';
import HeightCard from './height-card';
import WeightCard from './weight-card';
import AdviceCard from './advice-card';
import FloatingActionBar from '../floating-action-bar';
import { AssessmentResult, BabyInfo } from '@/lib/types';
import { getScoreLevel, getAverageData, generateAdviceModules } from '@/lib/assessment';

interface ResultsSectionProps {
  result: AssessmentResult;
  babyInfo: BabyInfo;
  onReset: () => void;
}

export default function ResultsSection({ result, babyInfo, onReset }: ResultsSectionProps) {
  const scoreLevel = getScoreLevel(result.score);
  const averageData = getAverageData(babyInfo);
  
  const [adviceModules, setAdviceModules] = useState({
    nutritionAdvice: '',
    exerciseAdvice: '',
    sleepAdvice: ''
  });
  
  const [loadingStates, setLoadingStates] = useState({
    nutrition: true,
    exercise: true,
    sleep: true
  });

  useEffect(() => {
    const fetchAdviceModules = async () => {
      try {
        const advice = await generateAdviceModules(babyInfo);
        setAdviceModules(advice);
      } catch (error) {
        console.error('Error fetching advice modules:', error);
      } finally {
        // 模拟逐个加载完成的效果
        setTimeout(() => setLoadingStates(prev => ({ ...prev, nutrition: false })), 1000);
        setTimeout(() => setLoadingStates(prev => ({ ...prev, exercise: false })), 1500);
        setTimeout(() => setLoadingStates(prev => ({ ...prev, sleep: false })), 2000);
      }
    };

    fetchAdviceModules();
  }, [babyInfo]);

  return (
    <>
      {/* 报告内容区域，添加ID用于截图 */}
      <div id="report-content" className="w-full max-w-4xl mx-auto bg-white px-6 py-8">
        {/* 简化标题区域 */}
        <div className="text-center mb-10">
          {/* 主标题 - 直接使用宝宝姓名的成长报告 */}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text mb-6">
            🎈 {babyInfo.name}的成长报告
          </h1>
          
          {/* 副标题 */}
          <p className="mt-2 text-gray-600 text-sm md:text-base font-medium mb-6">
            数据基于WHO儿童生长标准
          </p>
          
          {/* 宝宝信息标签 */}
          <div className="flex justify-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              📅 {babyInfo.age}个月
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
              {babyInfo.gender === 'male' ? '👦 男宝宝' : '👧 女宝宝'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ScoreCard 
              score={result.score} 
              scoreLevel={scoreLevel} 
              suggestion={result.suggestion}
            />
          </div>
          
          <HeightCard 
            height={Number(babyInfo.height)} 
            averageHeight={averageData.height} 
            status={result.heightStatus}
          />
          
          <WeightCard 
            weight={Number(babyInfo.weight)} 
            averageWeight={averageData.weight} 
            status={result.weightStatus}
          />
        </div>

        {/* 新增的三个建议模块 */}
        <div className="mt-8 mb-32">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            🌟 专属成长建议
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdviceCard
              title="饮食营养"
              icon="🍎"
              content={adviceModules.nutritionAdvice}
              loading={loadingStates.nutrition}
              delay={200}
            />
            
            <AdviceCard
              title="运动锻炼"
              icon="🏃‍♂️"
              content={adviceModules.exerciseAdvice}
              loading={loadingStates.exercise}
              delay={400}
            />
            
            <AdviceCard
              title="睡眠习惯"
              icon="😴"
              content={adviceModules.sleepAdvice}
              loading={loadingStates.sleep}
              delay={600}
            />
          </div>
        </div>
      </div>

      {/* 悬浮按钮栏 */}
      <FloatingActionBar onRetry={onReset} />
    </>
  );
}