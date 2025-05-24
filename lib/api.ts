import { Baby, Recommendation, Assessment } from "@/types";

export async function getRecommendation(
  baby: Baby,
  heightAssessment: Assessment,
  weightAssessment: Assessment
): Promise<Recommendation> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("/api/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: baby.age,
        gender: baby.gender === "male" ? "男宝宝" : "女宝宝",
        height: baby.height,
        weight: baby.weight,
        heightAssessment,
        weightAssessment,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // 性能监控
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    console.log(`API 请求耗时: ${duration}ms`);
    
    // 如果是从缓存返回的，通常会很快
    if (duration < 100) {
      console.log('✅ 缓存命中，响应很快！');
    } else if (duration < 3000) {
      console.log('⚡ 响应速度正常');
    } else {
      console.log('⚠️ 响应较慢，可能网络或服务器负载较高');
    }
    
    return data.recommendation;
  } catch (error) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    console.error(`API 请求失败，耗时: ${duration}ms`, error);
    
    // Provide fallback recommendation if API fails
    return {
      diet: "API请求失败，无法获取个性化饮食建议。一般来说，宝宝应保持均衡饮食，包含足够的蛋白质、碳水化合物、健康脂肪、维生素和矿物质。建议多吃新鲜蔬菜水果，适量摄入优质蛋白质如鱼肉、鸡蛋等。",
      exercise: "API请求失败，无法获取个性化运动建议。根据宝宝年龄，应当鼓励适当的身体活动，如爬行、行走、跑跳等，促进身体协调性发展。每天保证足够的户外活动时间，有助于骨骼和肌肉发育。",
      lifestyle: "API请求失败，无法获取个性化生活建议。一般来说，宝宝需要充足的睡眠、有规律的作息时间，以及丰富的互动和刺激，促进全面发展。建议创造安全舒适的成长环境，多与宝宝互动交流。"
    };
  }
}