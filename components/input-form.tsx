"use client";

import React, { useState } from 'react';
import { BabyInfo } from '@/lib/types';

interface InputFormProps {
  onSubmit: (data: BabyInfo) => void;
  loading: boolean;
  initialData?: BabyInfo;
}

export default function InputForm({ onSubmit, loading, initialData }: InputFormProps) {
  const [formData, setFormData] = useState<BabyInfo>({
    name: initialData?.name || '',
    age: initialData?.age || '',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    gender: initialData?.gender || 'male',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = '请输入宝宝的姓名或昵称';
    } else if (formData.name.trim().length > 20) {
      newErrors.name = '姓名长度不能超过20个字符';
    }

    if (!formData.age || formData.age < 0 || formData.age > 72) {
      newErrors.age = '请输入0-72个月之间的年龄';
    }

    if (!formData.height || formData.height < 40 || formData.height > 140) {
      newErrors.height = '请输入40-140厘米之间的身高';
    }

    if (!formData.weight || formData.weight < 2 || formData.weight > 40) {
      newErrors.weight = '请输入2-40公斤之间的体重';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as BabyInfo);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg transition-all"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            宝宝姓名或昵称
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="例如：小明、宝宝、豆豆"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            宝宝月龄（月）
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="72"
            step="1"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="例如：12"
          />
          {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            宝宝身高（厘米）
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="40"
            max="140"
            step="0.1"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="例如：75"
          />
          {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            宝宝体重（公斤）
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="2"
            max="40"
            step="0.1"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="例如：9"
          />
          {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            宝宝性别
          </label>
          <div className="flex gap-4">
            <label className="flex-1">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-full text-center py-3 rounded-xl border transition-all cursor-pointer ${
                formData.gender === 'male'
                  ? 'bg-blue-50 border-blue-400 text-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                👦 男宝宝
              </div>
            </label>
            <label className="flex-1">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-full text-center py-3 rounded-xl border transition-all cursor-pointer ${
                formData.gender === 'female'
                  ? 'bg-pink-50 border-pink-400 text-pink-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                👧 女宝宝
              </div>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-3 px-6 rounded-xl text-white font-medium text-base transition-all bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 active:translate-y-0.5"
      >
        立即测试
      </button>
    </form>
  );
}