import { Recommendation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UtensilsIcon, 
  ActivityIcon, 
  SunIcon,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "@/lib/motion";

interface RecommendationSectionProps {
  recommendation: Recommendation;
}

export default function RecommendationSection({ recommendation }: RecommendationSectionProps) {
  const { diet, exercise, lifestyle } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 pb-2">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-teal-500 mr-2" />
            <CardTitle className="text-xl text-teal-700">个性化养育建议</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="diet" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="diet" className="flex items-center justify-center">
                <UtensilsIcon className="h-4 w-4 mr-2" />
                <span>饮食建议</span>
              </TabsTrigger>
              <TabsTrigger value="exercise" className="flex items-center justify-center">
                <ActivityIcon className="h-4 w-4 mr-2" />
                <span>运动建议</span>
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex items-center justify-center">
                <SunIcon className="h-4 w-4 mr-2" />
                <span>生活建议</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="diet" className="mt-0">
              <div className="bg-white p-4 rounded-lg border border-teal-100">
                <p className="whitespace-pre-line text-gray-700">{diet}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="exercise" className="mt-0">
              <div className="bg-white p-4 rounded-lg border border-teal-100">
                <p className="whitespace-pre-line text-gray-700">{exercise}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="lifestyle" className="mt-0">
              <div className="bg-white p-4 rounded-lg border border-teal-100">
                <p className="whitespace-pre-line text-gray-700">{lifestyle}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}