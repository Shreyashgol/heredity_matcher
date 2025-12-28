const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set (length: ' + process.env.GEMINI_API_KEY.length + ')' : 'NOT SET');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('✗ GEMINI_API_KEY is not set in .env file');
      process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try with gemini-1.5-flash (latest stable model)
    console.log('\nTrying model: gemini-1.5-flash');
    let model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    console.log('Sending test prompt...');
    let prompt = 'Write a brief 2-sentence summary about genetic inheritance.';
    
    try {
      let result = await model.generateContent(prompt);
      let response = result.response;
      let text = response.text();
      
      console.log('\n✓ SUCCESS! Gemini API is working with gemini-1.5-flash!');
      console.log('\nResponse:');
      console.log(text);
      console.log('\nResponse length:', text.length, 'characters');
      process.exit(0);
    } catch (flashError) {
      console.log('✗ gemini-1.5-flash failed:', flashError.message);
      
      // Try gemini-pro as fallback
      console.log('\nTrying fallback model: gemini-pro');
      model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('\n✓ SUCCESS! Gemini API is working with gemini-pro!');
      console.log('\nResponse:');
      console.log(text);
      console.log('\nResponse length:', text.length, 'characters');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.message.includes('404')) {
      console.error('\nPossible causes:');
      console.error('1. Model "gemini-pro" not available in your region');
      console.error('2. API key may not have access to this model');
      console.error('3. SDK version incompatibility');
      console.error('\nCurrent SDK version: @google/generative-ai@0.21.0');
      console.error('\nTry:');
      console.error('- Check Google AI Studio: https://aistudio.google.com/');
      console.error('- Verify API key has correct permissions');
      console.error('- Try upgrading SDK: npm install @google/generative-ai@latest');
    }
    
    process.exit(1);
  }
}

testGemini();
