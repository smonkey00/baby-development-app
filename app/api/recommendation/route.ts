import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('🔄 收到 API 请求');
  
  try {
    const body = await request.json();
    const { age, gender, height, weight, heightAssessment, weightAssessment } = body;
    
    console.log('📝 请求参数:', { age, gender, height, weight, heightAssessment, weightAssessment });
    
    // 直接使用 fetch 调用 OpenRouter API
    const prompt = `宝宝：${age}个月${gender}，身高${height}cm(${heightAssessment})，体重${weight}kg(${weightAssessment})。请给出简洁的饮食、运动、生活建议，每项50字内。`;

    console.log('🚀 开始调用 OpenRouter API...');
    const startTime = Date.now();
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    const endTime = Date.now();
    console.log(`⏱️ API 调用耗时: ${endTime - startTime}ms`);
    console.log(`📊 响应状态: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 响应错误:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const completion = await response.json();
    console.log('✅ API 调用成功');
    
    const responseText = completion.choices?.[0]?.message?.content || "";
    console.log('📄 AI 响应:', responseText.substring(0, 100) + '...');
    
    const recommendation = processAIResponse(responseText);
    
    return NextResponse.json({ recommendation }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    
  } catch (error: any) {
    console.error('💥 请求失败:', error.message);
    
    // 提供降级服务
    const fallbackRecommendation = {
      diet: "建议按月龄添加辅食，保证营养均衡，多吃新鲜蔬果。",
      exercise: "根据宝宝发育情况，适当进行爬行、站立等运动。",
      lifestyle: "保持规律作息，创造安全舒适的成长环境。"
    };
    
    return NextResponse.json(
      { recommendation: fallbackRecommendation },
      { status: 200 }
    );
  }
}

function processAIResponse(text: string): { diet: string; exercise: string; lifestyle: string } {
  // Default values
  let diet = "建议按月龄添加辅食，保证营养均衡。";
  let exercise = "根据宝宝发育情况，适当运动。";
  let lifestyle = "保持规律作息，创造安全环境。";
  
  try {
    const lines = text.split("\n").map(line => line.trim()).filter(line => line);
    
    let currentSection = "";
    let dietLines: string[] = [];
    let exerciseLines: string[] = [];
    let lifestyleLines: string[] = [];
    
    for (const line of lines) {
      if (/饮食|营养|喂养/.test(line)) {
        currentSection = "diet";
        const content = line.replace(/^[1１][\.\、\:]?\s*(饮食|营养|喂养).*?[\:\：]?\s*/, '');
        if (content && content.length > 5) dietLines.push(content);
        continue;
      } else if (/运动|活动|锻炼/.test(line)) {
        currentSection = "exercise";
        const content = line.replace(/^[2２][\.\、\:]?\s*(运动|活动|锻炼).*?[\:\：]?\s*/, '');
        if (content && content.length > 5) exerciseLines.push(content);
        continue;
      } else if (/生活|作息|环境/.test(line)) {
        currentSection = "lifestyle";
        const content = line.replace(/^[3３][\.\、\:]?\s*(生活|作息|环境).*?[\:\：]?\s*/, '');
        if (content && content.length > 5) lifestyleLines.push(content);
        continue;
      }
      
      // 跳过无用的行
      if (line.length < 8 || line.startsWith("请") || line.startsWith("建议")) {
        continue;
      }
      
      // 分配到对应的部分
      if (currentSection === "diet") {
        dietLines.push(line);
      } else if (currentSection === "exercise") {
        exerciseLines.push(line);
      } else if (currentSection === "lifestyle") {
        lifestyleLines.push(line);
      }
    }
    
    if (dietLines.length > 0) {
      diet = dietLines.join(" ").substring(0, 100);
    }
    
    if (exerciseLines.length > 0) {
      exercise = exerciseLines.join(" ").substring(0, 100);
    }
    
    if (lifestyleLines.length > 0) {
      lifestyle = lifestyleLines.join(" ").substring(0, 100);
    }
  } catch (error: any) {
    console.error("解析 AI 响应失败:", error.message);
  }
  
  return { diet, exercise, lifestyle };
}