// Test script for AI report generation
require('dotenv').config();
const { generateRiskReport } = require('./services/geminiService');

const testData = {
  patientName: 'John Doe',
  conditionName: 'Diabetes',
  totalRisk: 75,
  riskLevel: 'High',
  affectedAncestors: [
    {
      name: 'Mary Doe',
      generation: 1,
      risk: 50,
      diagnosedDate: '2010-05-15'
    },
    {
      name: 'Robert Smith',
      generation: 2,
      risk: 25,
      diagnosedDate: '1995-03-20'
    }
  ]
};

async function test() {
  console.log('Testing AI Report Generation...\n');
  console.log('Test Data:', JSON.stringify(testData, null, 2));
  console.log('\n' + '='.repeat(80) + '\n');
  
  const result = await generateRiskReport(testData);
  
  console.log('Result:', {
    success: result.success,
    error: result.error,
    reportLength: result.report?.length || 0,
    generatedAt: result.generatedAt
  });
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  if (result.success && result.report) {
    console.log('Generated Report:\n');
    console.log(result.report);
  } else {
    console.error('Failed to generate report:', result.error);
  }
}

test().catch(console.error);
