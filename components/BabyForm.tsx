"use client";

import { useState, useEffect } from "react";
import { Baby } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { validateForm } from "@/lib/validation";
import { motion } from "@/lib/motion";

interface BabyFormProps {
  onSubmit: (data: Baby) => void;
  initialData: Baby | null;
  loading: boolean;
}

export default function BabyForm({ onSubmit, initialData, loading }: BabyFormProps) {
  const [formData, setFormData] = useState<Baby>({
    age: initialData?.age || 0,
    height: initialData?.height || 0,
    weight: initialData?.weight || 0,
    gender: initialData?.gender || "male",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "age" || name === "height" || name === "weight") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenderChange = (value: "male" | "female") => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">宝宝信息</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="age" className="text-gray-700">
              宝宝年龄（月）
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age || ""}
              onChange={handleChange}
              className={`mt-1 ${errors.age ? "border-red-500" : ""}`}
              placeholder="请输入宝宝月龄（0-72个月）"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <Label htmlFor="height" className="text-gray-700">
              身高（cm）
            </Label>
            <Input
              id="height"
              name="height"
              type="number"
              step="0.1"
              value={formData.height || ""}
              onChange={handleChange}
              className={`mt-1 ${errors.height ? "border-red-500" : ""}`}
              placeholder="请输入宝宝身高（30-130cm）"
            />
            {errors.height && (
              <p className="text-red-500 text-sm mt-1">{errors.height}</p>
            )}
          </div>

          <div>
            <Label htmlFor="weight" className="text-gray-700">
              体重（kg）
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight || ""}
              onChange={handleChange}
              className={`mt-1 ${errors.weight ? "border-red-500" : ""}`}
              placeholder="请输入宝宝体重（3-30kg）"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <Label className="text-gray-700 block mb-2">性别</Label>
            <RadioGroup 
              value={formData.gender} 
              onValueChange={(value) => handleGenderChange(value as "male" | "female")}
              className="flex space-x-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">男宝宝</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">女宝宝</Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              处理中...
            </div>
          ) : (
            "立即测试"
          )}
        </Button>
      </form>
    </motion.div>
  );
}