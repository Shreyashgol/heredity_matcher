const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const modelNames = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro',
];

async function testModel(genAI, modelName) {
  try {
    console.log(`\nTesting: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent('Say "Hello" in one word.');
    const text = result.response.text();
    
    console.log(`✓ SUCCESS with ${modelName}!`);
    console.log(`  Response: ${text}`);
    return true;
  } catch (error) {
    console.log(`✗ Failed: ${error.message.substring(0, 100)}...`);
    return false;
  }
}

async function testAllModels() {
  console.log('Testing Gemini API with different model names...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set (length: ' + process.env.GEMINI_API_KEY.length + ')' : 'NOT SET');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('\n✗ GEMINI_API_KEY is not set');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  let successCount = 0;
  
  for (const modelName of modelNames) {
    const success = await testModel(genAI, modelName);
    if (success) {
      successCount++;
      console.log('\n🎉 Found working model! You can use:', modelName);
      break;
    }
  }
  
  if (successCount === 0) {
    console.log('\n❌ No working models found.');
    console.log('\nPossible issues:');
    console.log('1. API key may not have Generative Language API enabled');
    console.log('2. API key may be restricted to certain models');
    console.log('3. Regional restrictions may apply');
    console.log('\nTo fix:');
    console.log('- Visit https://aistudio.google.com/app/apikey');
    console.log('- Create a new API key');
    console.log('- Ensure "Generative Language API" is enabled');
    console.log('- Try the API key in Google AI Studio first');
  }
}

testAllModels();
