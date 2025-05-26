import { AssessmentResult, AssessmentStatus, BabyInfo, ScoreLevel } from "./types";
import { getAISuggestion, getNutritionAdvice, getExerciseAdvice, getSleepAdvice } from "./api";

// WHO standard growth charts data (simplified for this example)
const maleHeightAverage: Record<number, number> = {
  0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6, 
  7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5, 12: 75.7,
  13: 76.9, 14: 78.0, 15: 79.1, 16: 80.2, 17: 81.2, 18: 82.3,
  19: 83.2, 20: 84.2, 21: 85.1, 22: 86.0, 23: 86.9, 24: 87.8,
  36: 96.1, 48: 102.9, 60: 109.9
};

const femaleHeightAverage: Record<number, number> = {
  0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0, 6: 65.7, 
  7: 67.3, 8: 68.7, 9: 70.1, 10: 71.5, 11: 72.8, 12: 74.0,
  13: 75.2, 14: 76.4, 15: 77.5, 16: 78.6, 17: 79.7, 18: 80.7,
  19: 81.7, 20: 82.7, 21: 83.7, 22: 84.6, 23: 85.5, 24: 86.4,
  36: 95.1, 48: 101.6, 60: 108.4
};

const maleWeightAverage: Record<number, number> = {
  0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9, 
  7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6,
  13: 9.9, 14: 10.1, 15: 10.3, 16: 10.5, 17: 10.7, 18: 10.9,
  19: 11.1, 20: 11.3, 21: 11.5, 22: 11.8, 23: 12.0, 24: 12.2,
  36: 14.3, 48: 16.3, 60: 18.3
};

const femaleWeightAverage: Record<number, number> = {
  0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3, 
  7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
  13: 9.2, 14: 9.4, 15: 9.6, 16: 9.8, 17: 10.0, 18: 10.2,
  19: 10.4, 20: 10.6, 21: 10.9, 22: 11.1, 23: 11.3, 24: 11.5,
  36: 13.9, 48: 15.9, 60: 17.9
};

// Helper function to get the closest age data point
const getClosestAge = (age: number | '', maxAge: number = 60): number => {
  const ageNum = Number(age);
  if (!ageNum || isNaN(ageNum)) return 12; // Default to 12 months if invalid
  if (ageNum <= 24) return ageNum;
  if (ageNum > maxAge) return maxAge;
  
  // For ages 25-60, find the closest benchmark (24, 36, 48, 60)
  const benchmarks = [24, 36, 48, 60];
  return benchmarks.reduce((prev, curr) => 
    Math.abs(curr - ageNum) < Math.abs(prev - ageNum) ? curr : prev
  );
};

// Assess height relative to average
export const assessHeight = (baby: BabyInfo): AssessmentStatus => {
  const averageHeights = baby.gender === 'male' ? maleHeightAverage : femaleHeightAverage;
  const closestAge = getClosestAge(baby.age);
  const averageHeight = averageHeights[closestAge];
  const height = Number(baby.height);
  
  if (!height || isNaN(height)) return 'normal';
  
  const heightDiff = ((height - averageHeight) / averageHeight) * 100;
  
  if (heightDiff > 15) return 'high';
  if (heightDiff > 5) return 'slightly-high';
  if (heightDiff >= -5) return 'normal';
  if (heightDiff >= -15) return 'slightly-low';
  return 'low';
};

// Assess weight relative to average
export const assessWeight = (baby: BabyInfo): AssessmentStatus => {
  const averageWeights = baby.gender === 'male' ? maleWeightAverage : femaleWeightAverage;
  const closestAge = getClosestAge(baby.age);
  const averageWeight = averageWeights[closestAge];
  const weight = Number(baby.weight);
  
  if (!weight || isNaN(weight)) return 'normal';
  
  const weightDiff = ((weight - averageWeight) / averageWeight) * 100;
  
  if (weightDiff > 20) return 'high';
  if (weightDiff > 7) return 'slightly-high';
  if (weightDiff >= -7) return 'normal';
  if (weightDiff >= -20) return 'slightly-low';
  return 'low';
};

// Calculate overall development score
export const calculateScore = (heightStatus: AssessmentStatus, weightStatus: AssessmentStatus): number => {
  // Base score is 75
  let score = 75;
  
  // Add or subtract points based on status
  const statusScores: Record<AssessmentStatus, number> = {
    'high': 5,
    'slightly-high': 10, 
    'normal': 15,
    'slightly-low': 5,
    'low': 0
  };
  
  score += statusScores[heightStatus];
  score += statusScores[weightStatus];
  
  // Ensure score is between 0 and 100
  return Math.min(100, Math.max(0, score));
};

// Get score level based on score value
export const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 90) {
    return {
      level: 'excellent',
      emoji: '🎉',
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      description: '非常棒，要保持哦'
    };
  } else if (score >= 75) {
    return {
      level: 'good',
      emoji: '💪',
      color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      description: '还可以哦，继续加油'
    };
  } else if (score >= 60) {
    return {
      level: 'average',
      emoji: '😬',
      color: 'bg-gradient-to-r from-amber-400 to-orange-500',
      description: '再不努力就跟不上了哦'
    };
  } else {
    return {
      level: 'below-average',
      emoji: '🐢',
      color: 'bg-gradient-to-r from-red-400 to-pink-500',
      description: '要加油了'
    };
  }
};

// Get average data for reference
export const getAverageData = (baby: BabyInfo) => {
  const closestAge = getClosestAge(baby.age);
  
  return {
    height: baby.gender === 'male' 
      ? maleHeightAverage[closestAge] 
      : femaleHeightAverage[closestAge],
    weight: baby.gender === 'male' 
      ? maleWeightAverage[closestAge] 
      : femaleWeightAverage[closestAge]
  };
};

// Status to display text mapping
export const statusToText: Record<AssessmentStatus, string> = {
  'high': '偏高',
  'slightly-high': '稍高',
  'normal': '标准',
  'slightly-low': '稍低',
  'low': '偏低'
};

// Status to color mapping
export const statusToColor: Record<AssessmentStatus, string> = {
  'high': 'text-pink-500',
  'slightly-high': 'text-rose-400',
  'normal': 'text-green-500',
  'slightly-low': 'text-amber-500',
  'low': 'text-red-500'
};

// Generate a complete assessment
export const generateAssessment = async (baby: BabyInfo): Promise<AssessmentResult> => {
  const heightStatus = assessHeight(baby);
  const weightStatus = assessWeight(baby);
  const score = calculateScore(heightStatus, weightStatus);
  
  try {
    const suggestion = await getAISuggestion(baby);
    return {
      score,
      heightStatus,
      weightStatus,
      suggestion
    };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return {
      score,
      heightStatus,
      weightStatus,
      suggestion: getDefaultSuggestion(baby, heightStatus, weightStatus)
    };
  }
};

// Generate advice for specific modules
export const generateAdviceModules = async (baby: BabyInfo) => {
  try {
    const [nutritionAdvice, exerciseAdvice, sleepAdvice] = await Promise.all([
      getNutritionAdvice(baby),
      getExerciseAdvice(baby),
      getSleepAdvice(baby)
    ]);

    return {
      nutritionAdvice,
      exerciseAdvice,
      sleepAdvice
    };
  } catch (error) {
    console.error('Error getting advice modules:', error);
    return {
      nutritionAdvice: getDefaultNutritionAdvice(baby),
      exerciseAdvice: getDefaultExerciseAdvice(baby),
      sleepAdvice: getDefaultSleepAdvice(baby)
    };
  }
};

// Default advice functions (moved from api.ts for consistency)
const getDefaultNutritionAdvice = (baby: BabyInfo): string => {
  const age = Number(baby.age);
  const name = baby.name;
  
  if (age < 6) {
    return `${name}这个阶段主要以母乳或配方奶为主，每天6-8次喂养。注意观察${name}的饱腹信号，按需喂养。如果是母乳喂养，妈妈要保证营养均衡。`;
  } else if (age < 12) {
    return `${name}可以开始添加辅食了！建议从米粉开始，逐步添加蔬菜泥、水果泥。每次只添加一种新食物，观察3-5天无过敏反应再添加下一种。奶量仍是主要营养来源。`;
  } else if (age < 24) {
    return `${name}可以尝试更多食物了！建议三餐两点，包括软饭、蔬菜、水果、肉类。避免蜂蜜、坚果等易过敏食物。鼓励${name}自己用手抓食，培养进食兴趣。`;
  } else {
    return `${name}可以和家人一起用餐了！建议营养均衡，包含谷物、蔬菜、水果、蛋白质。控制零食和甜食，培养${name}良好的饮食习惯。每天保证足够的水分摄入。`;
  }
};

const getDefaultExerciseAdvice = (baby: BabyInfo): string => {
  const age = Number(baby.age);
  const name = baby.name;
  
  if (age < 6) {
    return `${name}这个阶段主要是被动运动。建议每天进行婴儿抚触和被动体操，促进${name}的血液循环。多让${name}趴着练习抬头，锻炼颈部和背部肌肉。`;
  } else if (age < 12) {
    return `${name}开始学会坐和爬了！鼓励${name}多趴着玩耍，练习爬行。可以用玩具引导${name}向前爬，锻炼四肢协调性。每天保证足够的自由活动时间。`;
  } else if (age < 24) {
    return `${name}正在学走路！提供安全的环境让${name}自由探索。可以玩推拉玩具、爬楼梯、踢球等游戏。每天户外活动1-2小时，促进${name}大运动发展。`;
  } else {
    return `${name}可以参与更多运动了！建议每天户外活动2-3小时，包括跑步、跳跃、攀爬等。可以玩滑梯、秋千、骑小车等，锻炼${name}的平衡能力和协调性。`;
  }
};

const getDefaultSleepAdvice = (baby: BabyInfo): string => {
  const age = Number(baby.age);
  const name = baby.name;
  
  if (age < 6) {
    return `${name}这个阶段需要充足睡眠，每天14-17小时。建议建立固定的睡前程序，如洗澡、喂奶、轻柔音乐。保持房间安静、温度适宜，帮助${name}建立昼夜节律。`;
  } else if (age < 12) {
    return `${name}每天需要12-15小时睡眠，包括2-3次小睡。建立规律作息，固定睡觉和起床时间。睡前避免过度刺激，可以读绘本、唱摇篮曲帮助${name}入睡。`;
  } else if (age < 24) {
    return `${name}每天需要11-14小时睡眠，通常1-2次小睡。建议晚上8-9点入睡，早上7-8点起床。睡前1小时避免激烈活动，营造安静的睡眠环境。`;
  } else {
    return `${name}每天需要10-13小时睡眠，可能还需要1次午睡。建议固定睡前程序，如刷牙、讲故事。避免睡前看电子屏幕，保持房间黑暗安静，帮助${name}养成良好睡眠习惯。`;
  }
};

// Generate a default suggestion based on assessment
const getDefaultSuggestion = (baby: BabyInfo, heightStatus: AssessmentStatus, weightStatus: AssessmentStatus): string => {
  const age = Number(baby.age);
  const name = baby.name;
  
  if (age < 12) {
    if (heightStatus === 'low' || weightStatus === 'low') {
      return `建议为${name}增加优质蛋白质摄入，确保每天有足够的睡眠时间，多做亲子互动。可以咨询医生关于${name}配方奶的营养补充方案。`;
    } else if (heightStatus === 'high' && weightStatus === 'high') {
      return `${name}发育良好！继续保持母乳或配方奶的喂养计划，逐步为${name}添加辅食，注重食物多样性。多带${name}进行户外活动，促进骨骼发育。`;
    } else {
      return `${name}发育正常！建议根据月龄逐步为${name}添加辅食，保持规律的作息时间，每天进行适当的身体活动，促进${name}的感官和运动发展。`;
    }
  } else if (age < 36) {
    if (heightStatus === 'low') {
      return `建议为${name}增加高钙食物的摄入，如奶制品、豆制品等。确保${name}有充足的户外活动时间，适度晒太阳可促进维生素D合成，有助于钙的吸收。`;
    } else if (weightStatus === 'high') {
      return `注意控制${name}的甜食和油腻食物摄入，增加蔬菜水果比例。鼓励${name}多运动，培养活跃的生活方式，如玩球、跑步等。`;
    } else {
      return `${name}发育良好！建议为${name}提供均衡饮食，包括蛋白质、碳水化合物、脂肪、维生素和矿物质。多陪${name}进行户外活动和亲子游戏，促进身体和大脑发育。`;
    }
  } else {
    if (heightStatus === 'low' || weightStatus === 'low') {
      return `关注${name}的饮食多样性，确保摄入足够的营养。可以适当增加${name}的运动量，如跳绳、骑车等，促进生长激素分泌。保持规律作息，确保${name}充足睡眠。`;
    } else if (weightStatus === 'high') {
      return `建议控制${name}高热量食物摄入，增加运动量。鼓励${name}参与有趣的体育活动，如游泳、跳舞等。减少屏幕时间，培养健康的生活习惯。`;
    } else {
      return `${name}发育状况良好！继续为${name}保持均衡饮食和充足运动。这个阶段可以培养${name}的社交能力和独立性，多参加集体活动，锻炼综合能力。`;
    }
  }
};