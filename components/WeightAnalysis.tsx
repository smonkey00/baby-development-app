import { WeightAnalysis as WeightAnalysisType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScaleIcon } from "lucide-react";
import { getAssessmentColor, getAssessmentIcon } from "@/lib/utils";
import { motion } from "@/lib/motion";

interface WeightAnalysisProps {
  analysis: WeightAnalysisType;
}

export default function WeightAnalysis({ analysis }: WeightAnalysisProps) {
  const { inputWeight, averageWeight, assessment } = analysis;
  const color = getAssessmentColor(assessment);
  const AssessmentIcon = getAssessmentIcon(assessment);
  const percentage = Math.round((inputWeight / averageWeight) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 pb-2">
          <div className="flex items-center">
            <ScaleIcon className="h-5 w-5 text-pink-500 mr-2" />
            <CardTitle className="text-xl text-pink-700">体重分析</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">宝宝体重</p>
              <p className="text-2xl font-bold text-pink-600">{inputWeight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">同龄均值</p>
              <p className="text-2xl font-bold text-gray-700">{averageWeight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">百分比</p>
              <p className="text-2xl font-bold text-orange-600">{percentage}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color.bg}`}>
                <AssessmentIcon className={`h-5 w-5 ${color.text}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">评估结果</p>
                <p className={`text-lg font-semibold ${color.text}`}>{assessment}</p>
              </div>
            </div>
            
            <div className="relative w-24 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${color.bar}`} 
                style={{ 
                  width: `${percentage > 150 ? 100 : (percentage < 50 ? 50 : percentage)}%`,
                  maxWidth: "100%" 
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}