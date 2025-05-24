const https = require('https');

const data = JSON.stringify({
  model: "deepseek/deepseek-chat-v3-0324",
  messages: [{ role: "user", content: "你好" }],
  temperature: 0.7,
  max_tokens: 100
});

const options = {
  hostname: 'openrouter.ai',
  port: 443,
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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',
    'Content-Length': data.length
  },
  timeout: 10000
};

console.log('🔄 开始测试 OpenRouter API...');
const startTime = Date.now();

const req = https.request(options, (res) => {
  const endTime = Date.now();
  console.log(`✅ 响应状态码: ${res.statusCode}`);
  console.log(`⏱️ 响应时间: ${endTime - startTime}ms`);
  console.log(`📋 响应头:`, res.headers);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      console.log('📄 API 响应:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('📄 原始响应:', body);
    }
  });
});

req.on('error', (error) => {
  const endTime = Date.now();
  console.error(`❌ 请求失败，耗时: ${endTime - startTime}ms`);
  console.error('错误详情:', error.message);
});

req.on('timeout', () => {
  console.error('⏰ 请求超时');
  req.destroy();
});

req.write(data);
req.end(); 