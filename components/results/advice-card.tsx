"use client";

import React, { useState, useEffect } from 'react';

interface AdviceCardProps {
  title: string;
  icon: string;
  content: string;
  loading: boolean;
  delay?: number;
}

export default function AdviceCard({ title, icon, content, loading, delay = 0 }: AdviceCardProps) {
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
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
} 