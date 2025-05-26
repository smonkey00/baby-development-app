"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BarChartProps {
  value: number;
  average: number;
  label: string;
  averageLabel: string;
  unit: string;
  status: string;
  statusColor: string;
  className?: string;
}

export function BarChart({
  value,
  average,
  label,
  averageLabel,
  unit,
  status,
  statusColor,
  className,
}: BarChartProps) {
  // Calculate the higher value to set as max for the chart
  const maxValue = Math.max(value, average) * 1.2;
  
  // Calculate percentages for the bars
  const valuePercent = (value / maxValue) * 100;
  const averagePercent = (average / maxValue) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 mb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm font-medium">{value} {unit}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${valuePercent}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{averageLabel}</span>
            <span className="text-sm font-medium">{average.toFixed(1)} {unit}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${averagePercent}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <span className={cn("inline-block px-3 py-1 rounded-full text-sm font-medium", statusColor)}>
          {status}
        </span>
      </div>
    </div>
  );
}