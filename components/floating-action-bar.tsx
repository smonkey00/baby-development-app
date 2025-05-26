'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

interface FloatingActionBarProps {
  onRetry: () => void;
}

export default function FloatingActionBar({ onRetry }: FloatingActionBarProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveToAlbum = async () => {
    try {
      setIsGenerating(true);
      
      // 获取要截图的元素（整个报告内容）
      const element = document.getElementById('report-content');
      if (!element) {
        alert('未找到报告内容');
        return;
      }

      // 生成图片
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
      });

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `宝宝成长报告_${new Date().toLocaleDateString()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-3">
          {/* 重新测试按钮 - 副按钮 */}
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm md:text-base"
          >
            <span>重新测试</span>
          </button>

          {/* 保存为长图按钮 - 主按钮 */}
          <button
            onClick={handleSaveToAlbum}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm md:text-base"
          >
            <span>
              {isGenerating ? (
                "生成中..."
              ) : (
                "保存为长图"
              )}
            </span>
            {isGenerating && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </div>
        
        {/* 生成提示 */}
        {isGenerating && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">正在生成长图，请稍候...</p>
          </div>
        )}
      </div>
    </div>
  );
} 