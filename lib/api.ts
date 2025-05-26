import { BabyInfo } from './types';

// SiliconFlow API配置
const API_KEY = process.env.SILICONFLOW_API_KEY || 'sk-dbhedsfombdudikpifcgiagdogkgjbzzjycaodmrzhsfyqxv';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export async function getAISuggestion(baby: BabyInfo): Promise<string> {
  try {
    console.log('API Key:', API_KEY ? `Found (${API_KEY.substring(0, 10)}...)` : 'Not found');
    console.log('Making request to:', API_URL);
    
    const requestBody = {
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      messages: [
        {
          role: 'user',
          content: generatePrompt(baby)
        }
      ],
      max_tokens: 512,
      temperature: 0.7,
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('SiliconFlow API error:', response.status, errorText);
      console.log('Using local fallback suggestion instead');
      return getDefaultSuggestion(baby);
    }

    const data = await response.json();
    console.log('API response:', data);
    console.log('Using AI-generated suggestion');
    
    // SiliconFlow API响应格式处理
    const content = data.choices[0].message.content || getDefaultSuggestion(baby);
    
    // 如果有reasoning_content，可以在控制台输出用于调试
    if (data.choices[0].message.reasoning_content) {
      console.log('AI reasoning:', data.choices[0].message.reasoning_content);
    }
    
    return content;
  } catch (error) {
    console.error('Error calling SiliconFlow API:', error);
    console.log('Using local fallback suggestion instead');
    return getDefaultSuggestion(baby);
  }
}

// 饮食营养建议API
export async function getNutritionAdvice(baby: BabyInfo): Promise<string> {
  try {
    const requestBody = {
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      messages: [
        {
          role: 'user',
          content: generateNutritionPrompt(baby)
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      return getDefaultNutritionAdvice(baby);
    }

    const data = await response.json();
    return data.choices[0].message.content || getDefaultNutritionAdvice(baby);
  } catch (error) {
    console.error('Error calling nutrition API:', error);
    return getDefaultNutritionAdvice(baby);
  }
}

// 运动锻炼建议API
export async function getExerciseAdvice(baby: BabyInfo): Promise<string> {
  try {
    const requestBody = {
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      messages: [
        {
          role: 'user',
          content: generateExercisePrompt(baby)
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      return getDefaultExerciseAdvice(baby);
    }

    const data = await response.json();
    return data.choices[0].message.content || getDefaultExerciseAdvice(baby);
  } catch (error) {
    console.error('Error calling exercise API:', error);
    return getDefaultExerciseAdvice(baby);
  }
}

// 睡眠习惯建议API
export async function getSleepAdvice(baby: BabyInfo): Promise<string> {
  try {
    const requestBody = {
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      messages: [
        {
          role: 'user',
          content: generateSleepPrompt(baby)
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      return getDefaultSleepAdvice(baby);
    }

    const data = await response.json();
    return data.choices[0].message.content || getDefaultSleepAdvice(baby);
  } catch (error) {
    console.error('Error calling sleep API:', error);
    return getDefaultSleepAdvice(baby);
  }
}

function generatePrompt(baby: BabyInfo): string {
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  const ageInYears = Math.floor(Number(baby.age) / 12);
  const remainingMonths = Number(baby.age) % 12;
  const ageDescription = ageInYears > 0 ? 
    (remainingMonths > 0 ? `${ageInYears}岁${remainingMonths}个月` : `${ageInYears}岁`) : 
    `${baby.age}个月`;
  
  return `请用中文思考和回答。你是一名中国的儿科医生，现在有一个叫${baby.name}的已出生${baby.age}个月大（也就是${ageDescription}）的${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，身高${baby.height}厘米，体重${baby.weight}公斤。

重要：${baby.name}是${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，在文案中请使用"${genderPronoun}"来指代，不要用错性别代词。
注意：${baby.age}个月 = ${ageDescription}，请根据这个实际年龄给出合适的评价。

请针对${baby.name}这个已出生宝宝的生长发育情况，给出一段不超过80字的专业评价，说明${baby.name}的发育状况。
建议内容应该围绕：婴幼儿喂养、生长发育、日常护理等方面，绝对不要提及产检、孕期检查等内容。

严格要求：
1. 请直接用中文思考，不要先用英文再翻译
2. 使用中国人的自然表达方式和语言习惯
3. 语气要温和亲切，像中国医生在跟家长聊天
4. 不要使用过于专业的医学术语，用通俗易懂的话
5. 在评价中要适当提到${baby.name}的名字，让评价更有专属感
6. 回答直接给出评价，不要有任何前缀`;
}

function generateNutritionPrompt(baby: BabyInfo): string {
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  const ageInYears = Math.floor(Number(baby.age) / 12);
  const remainingMonths = Number(baby.age) % 12;
  const ageDescription = ageInYears > 0 ? 
    (remainingMonths > 0 ? `${ageInYears}岁${remainingMonths}个月` : `${ageInYears}岁`) : 
    `${baby.age}个月`;
  
  return `请用中文思考和回答。你是一名中国的儿童营养师，现在有一个叫${baby.name}的已出生${baby.age}个月大（也就是${ageDescription}）的${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，身高${baby.height}厘米，体重${baby.weight}公斤。

重要：${baby.name}是${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，在文案中请使用"${genderPronoun}"来指代，不要用错性别代词。
注意：${baby.age}个月 = ${ageDescription}，请根据这个实际年龄给出合适的饮食建议。

严格要求：
1. 绝对不要任何开头语，如"好的"、"我会"、"建议如下"、"以下是建议"等
2. 直接开始给建议，第一个字就是建议内容
3. 整个建议严格控制在100字以内，超过100字就停止
4. 语气要温和亲切，像中国营养师在给家长建议
5. 包含具体的食物例子，适当提及${baby.name}的名字`;
}

function generateExercisePrompt(baby: BabyInfo): string {
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  const ageInYears = Math.floor(Number(baby.age) / 12);
  const remainingMonths = Number(baby.age) % 12;
  const ageDescription = ageInYears > 0 ? 
    (remainingMonths > 0 ? `${ageInYears}岁${remainingMonths}个月` : `${ageInYears}岁`) : 
    `${baby.age}个月`;
  
  return `请用中文思考和回答。你是一名中国的儿童发育专家，现在有一个叫${baby.name}的已出生${baby.age}个月大（也就是${ageDescription}）的${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，身高${baby.height}厘米，体重${baby.weight}公斤。

重要：${baby.name}是${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，在文案中请使用"${genderPronoun}"来指代，不要用错性别代词。
注意：${baby.age}个月 = ${ageDescription}，请根据这个实际年龄给出合适的运动建议。

严格要求：
1. 绝对不要任何开头语，如"好的"、"我会"、"建议如下"、"以下是建议"等
2. 直接开始给建议，第一个字就是建议内容
3. 整个建议严格控制在100字以内，超过100字就停止
4. 语气要温和亲切，像中国专家在给家长建议
5. 包含具体的动作例子，适当提及${baby.name}的名字`;
}

function generateSleepPrompt(baby: BabyInfo): string {
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  const ageInYears = Math.floor(Number(baby.age) / 12);
  const remainingMonths = Number(baby.age) % 12;
  const ageDescription = ageInYears > 0 ? 
    (remainingMonths > 0 ? `${ageInYears}岁${remainingMonths}个月` : `${ageInYears}岁`) : 
    `${baby.age}个月`;
  
  return `请用中文思考和回答。你是一名中国的儿童睡眠专家，现在有一个叫${baby.name}的已出生${baby.age}个月大（也就是${ageDescription}）的${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，身高${baby.height}厘米，体重${baby.weight}公斤。

重要：${baby.name}是${baby.gender === 'male' ? '男宝宝' : '女宝宝'}，在文案中请使用"${genderPronoun}"来指代，不要用错性别代词。
注意：${baby.age}个月 = ${ageDescription}，请根据这个实际年龄给出合适的睡眠建议。

严格要求：
1. 绝对不要任何开头语，如"好的"、"我会"、"建议如下"、"以下是建议"等
2. 直接开始给建议，第一个字就是建议内容
3. 整个建议严格控制在100字以内，超过100字就停止
4. 语气要温和亲切，像中国专家在给家长建议
5. 包含具体的方法例子，适当提及${baby.name}的名字`;
}

function getDefaultSuggestion(baby: BabyInfo): string {
  const age = Number(baby.age);
  const name = baby.name;
  
  if (age < 12) {
    return `${name}的发育情况总体良好！这个阶段${name}生长发育快，建议保持良好的喂养习惯和充足睡眠，多进行亲子互动促进感官发展。`;
  } else if (age < 36) {
    return `${name}正处在快速发育期！建议保持均衡饮食，多让${name}进行户外活动锻炼大肌肉群，保持规律作息促进健康成长。`;
  } else {
    return `${name}的成长表现不错！建议提供多样化食物选择，鼓励${name}参与各种体育活动，控制电子产品使用时间，多进行户外活动。`;
  }
}

function getDefaultNutritionAdvice(baby: BabyInfo): string {
  const age = Number(baby.age);
  const name = baby.name;
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  
  if (age < 6) {
    return `${name}现在主要喝奶就够了，母乳或配方奶都很好。观察${genderPronoun}的小表情，饿了就喂，饱了就停。妈妈记得自己也要吃好哦！`;
  } else if (age < 12) {
    return `${name}可以开始尝试辅食啦！先从米粉开始，然后试试胡萝卜泥、苹果泥。每次只加一样新食物，观察几天没问题再换下一样。`;
  } else if (age < 24) {
    return `${name}现在是小吃货了！可以吃软饭、小面条、蒸蛋羹。让${genderPronoun}自己用手抓着吃，虽然会弄得到处都是，但这样能锻炼${genderPronoun}的小手哦！`;
  } else {
    return `${name}可以和大人一起吃饭了！记得少盐少糖，多给${genderPronoun}吃蔬菜水果。零食要控制，白开水是最好的饮料！`;
  }
}

function getDefaultExerciseAdvice(baby: BabyInfo): string {
  const age = Number(baby.age);
  const name = baby.name;
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  
  if (age < 6) {
    return `${name}现在主要是躺着和趴着。每天给${genderPronoun}做做婴儿操，轻轻按摩小胳膊小腿。多让${genderPronoun}趴着玩，练习抬头看世界！`;
  } else if (age < 12) {
    return `${name}开始会坐会爬了！在地上铺个爬行垫，放些玩具引导${genderPronoun}爬过去。爬行对大脑发育特别好，多让${genderPronoun}爬爬！`;
  } else if (age < 24) {
    return `${name}正在学走路！可以让${genderPronoun}推小推车、踢皮球、爬小台阶。户外多走走，新鲜空气对${genderPronoun}身体好！`;
  } else {
    return `${name}已经是小运动员了！可以让${genderPronoun}尝试精细动作，比如扣扣子、夹豆子、画画。还可以跑跑跳跳、玩滑梯，每天至少户外活动2小时！`;
  }
}

function getDefaultSleepAdvice(baby: BabyInfo): string {
  const age = Number(baby.age);
  const name = baby.name;
  const genderPronoun = baby.gender === 'male' ? '他' : '她';
  
  if (age < 6) {
    return `${name}现在需要很多睡眠，一天要睡15-16小时。建立睡前仪式：洗澡、喂奶、轻音乐。房间要安静，温度适宜，帮${genderPronoun}养成好的睡眠习惯。`;
  } else if (age < 12) {
    return `${name}每天要睡12-14小时，包括白天的小觉。固定睡觉时间很重要，睡前可以读读小绘本、唱摇篮曲，让${genderPronoun}安静下来。`;
  } else if (age < 24) {
    return `${name}晚上可以睡整觉了！建议8-9点上床，早上7-8点起床。睡前1小时不要太兴奋的游戏，可以讲讲故事，营造安静的氛围。`;
  } else {
    return `${name}每天需要10-12小时睡眠。可以建立睡前程序：刷牙、洗脸、讲故事。避免睡前看电视，保持房间黑暗安静，帮${genderPronoun}睡个好觉！`;
  }
}