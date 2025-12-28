const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  try {
    console.log('Listing available Gemini models...\n');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('✗ GEMINI_API_KEY is not set');
      process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const models = await genAI.listModels();
    
    console.log('Available models:');
    console.log('='.repeat(60));
    
    for (const model of models) {
      console.log(`\nModel: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`Total models: ${models.length}`);
    
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    
    if (error.message.includes('403') || error.message.includes('API key')) {
      console.error('\nAPI Key issue detected:');
      console.error('- Verify your API key is correct');
      console.error('- Check if API key has Generative Language API enabled');
      console.error('- Visit: https://aistudio.google.com/app/apikey');
    }
  }
}

listModels();
