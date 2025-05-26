"use client";

import React, { useState, useEffect } from 'react';
import { ProgressRing } from '../ui/progress-ring';
import { ScoreLevel } from '@/lib/types';

interface ScoreCardProps {
  score: number;
  scoreLevel: ScoreLevel;
  suggestion: string;
}

export default function ScoreCard({ score, scoreLevel, suggestion }: ScoreCardProps) {
  const [visible, setVisible] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    const scoreTimer = setTimeout(() => {
      setShowScore(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(scoreTimer);
    };
  }, []);

  return (
    <div 
      className={`w-full bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-xl font-semibold text-center mb-4">📊 宝宝成长得分</h2>
      
      <div className="flex flex-col items-center">
        <ProgressRing 
          value={showScore ? score : 0}
          size={150}
          strokeWidth={12}
          foreground={scoreLevel.color}
          label={
            <div className="text-center">
              <span className="text-4xl font-bold">{Math.round(showScore ? score : 0)}</span>
              <span className="text-sm text-gray-500 block">分</span>
            </div>
          }
        />
        
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">
            {scoreLevel.emoji} {scoreLevel.description}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <p className="text-sm text-gray-700 leading-relaxed text-center">{suggestion}</p>
      </div>
    </div>
  );
}