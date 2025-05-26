"use client";

import React, { useState, useEffect } from 'react';
import { BarChart } from '../ui/bar-chart';
import { AssessmentStatus } from '@/lib/types';
import { statusToText, statusToColor } from '@/lib/assessment';

interface HeightCardProps {
  height: number;
  averageHeight: number;
  status: AssessmentStatus;
  delay?: number;
}

export default function HeightCard({ height, averageHeight, status, delay = 300 }: HeightCardProps) {
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
      <h2 className="text-xl font-semibold mb-4">📏 身高分析</h2>
      
      <BarChart
        value={height}
        average={averageHeight}
        label="宝宝当前身高"
        averageLabel="同龄平均身高"
        unit="厘米"
        status={statusToText[status]}
        statusColor={statusToColor[status]}
      />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {status === 'normal' 
            ? '宝宝身高处于同龄水平，发育正常！' 
            : status === 'high' || status === 'slightly-high'
              ? '宝宝身高高于同龄水平，发育良好！'
              : '宝宝身高低于同龄水平，需要关注营养摄入。'}
        </p>
      </div>
    </div>
  );
}