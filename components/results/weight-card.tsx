"use client";

import React, { useState, useEffect } from 'react';
import { BarChart } from '../ui/bar-chart';
import { AssessmentStatus } from '@/lib/types';
import { statusToText, statusToColor } from '@/lib/assessment';

interface WeightCardProps {
  weight: number;
  averageWeight: number;
  status: AssessmentStatus;
  delay?: number;
}

export default function WeightCard({ weight, averageWeight, status, delay = 600 }: WeightCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`w-full bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">⚖️ 体重分析</h2>
      
      <BarChart
        value={weight}
        average={averageWeight}
        label="宝宝当前体重"
        averageLabel="同龄平均体重"
        unit="公斤"
        status={statusToText[status]}
        statusColor={statusToColor[status]}
      />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {status === 'normal' 
            ? '宝宝体重处于健康范围，营养均衡！' 
            : status === 'high' || status === 'slightly-high'
              ? '宝宝体重高于同龄水平，注意饮食控制。'
              : '宝宝体重低于同龄水平，需要关注营养摄入。'}
        </p>
      </div>
    </div>
  );
}