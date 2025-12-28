const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateRiskReport = async (data) => {
  try {
    if (!data.patientName || (!data.conditionName && !data.condition)) {
      console.error('Missing required data for AI report generation:', data);
      return {
        success: false,
        report: 'Unable to generate AI report: Missing patient information',
        error: 'Missing required data',
        generatedAt: new Date().toISOString()
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Skipping AI report generation.');
      return {
        success: false,
        report: 'AI report generation is currently unavailable. Please configure the Gemini API key.',
        error: 'API key not configured',
        generatedAt: new Date().toISOString()
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro'
    })
    
    const familyHistoryDetails = data.affectedAncestors
      .map(a => {
        const generationName = {
          1: 'Parent',
          2: 'Grandparent',
          3: 'Great-grandparent',
          4: 'Great-great-grandparent'
        }[a.generation] || 'Ancestor';
        
        return `- ${a.name} (${generationName}, Generation ${a.generation}): ${a.risk}% genetic contribution`;
      })
      .join('\n');

    const prompt = `You are a professional genetic counselor and medical advisor. Generate a comprehensive, FAANG-quality medical risk assessment report for a patient based on their family health history.

PATIENT INFORMATION:
- Name: ${data.patientName}
- Condition of Interest: ${data.conditionName || data.condition}
- Calculated Genetic Risk: ${data.totalRisk}%
- Risk Classification: ${data.riskLevel}

FAMILY MEDICAL HISTORY:
${familyHistoryDetails}

INSTRUCTIONS:
Create a professional, detailed medical report with the following structure:

1. **EXECUTIVE SUMMARY**
   - Provide a clear, concise overview of the patient's genetic risk
   - State the calculated risk percentage and classification
   - Explain what this means in practical terms

2. **GENETIC RISK ANALYSIS**
   - Explain the inheritance pattern for ${data.conditionName || data.condition}
   - Detail how family history contributes to the patient's risk
   - Analyze the significance of affected relatives by generation
   - Discuss the cumulative effect of multiple affected family members

3. **DISEASE OVERVIEW**
   - Describe ${data.conditionName || data.condition} in medical terms
   - Explain early warning signs and symptoms
   - Discuss prevalence in the general population vs. with family history

4. **PERSONALIZED RISK ASSESSMENT**
   - Interpret the ${data.totalRisk}% risk for this specific patient
   - Compare to population baseline risk
   - Discuss what this risk means for the patient's health planning

5. **PREVENTIVE MEASURES & LIFESTYLE MODIFICATIONS**
   - Recommend specific screening protocols based on risk level
   - Suggest lifestyle changes to minimize disease risk
   - Provide dietary recommendations
   - Recommend exercise and stress management strategies
   - Discuss sleep and other health factors

6. **MEDICAL SCREENING RECOMMENDATIONS**
   - Recommend specific tests and their frequency
   - Suggest age to start screening
   - Recommend specialist consultations if needed
   - Discuss genetic testing options

7. **MEDICATION & TREATMENT CONSIDERATIONS**
   - Discuss preventive medications if applicable
   - Explain when pharmacological intervention might be considered
   - Discuss side effects and benefits

8. **FAMILY PLANNING CONSIDERATIONS**
   - If applicable, discuss implications for future children
   - Explain genetic counseling options
   - Discuss prenatal testing if relevant

9. **MONITORING & FOLLOW-UP**
   - Create a personalized monitoring schedule
   - Recommend annual check-ups and assessments
   - Suggest when to seek immediate medical attention

10. **CONCLUSION & ACTION PLAN**
    - Summarize key takeaways
    - Provide a clear action plan with priorities
    - Encourage proactive health management

TONE & STYLE:
- Professional and evidence-based
- Empathetic and supportive
- Clear and understandable for non-medical professionals
- Actionable and practical
- Avoid definitive diagnoses; focus on risk assessment
- Include specific, measurable recommendations

FORMAT:
- Use clear headings and subheadings
- Use bullet points for lists
- Keep paragraphs concise and focused
- Highlight key recommendations
- Make it suitable for printing as a medical report

IMPORTANT: Generate a complete, detailed report of at least 800 words. Be thorough and comprehensive.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('AI report generated successfully. Length:', text.length, 'characters');
    
    return {
      success: true,
      report: text,
      error: null,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating AI report:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      data: {
        patientName: data.patientName,
        condition: data.conditionName || data.condition,
        totalRisk: data.totalRisk
      }
    });
    
    // Use fallback report generation
    console.log('Using fallback report generation...');
    const { generateFallbackReport } = require('./fallbackReportService');
    return generateFallbackReport(data);
  }
};

module.exports = { generateRiskReport };
