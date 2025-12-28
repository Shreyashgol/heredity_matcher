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
     
    // Use gemini-2.0-flash-exp (experimental but available)
    console.log('Initializing Gemini AI with model: gemini-2.0-flash-exp');
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

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

    const prompt = `You are a professional genetic counselor and medical advisor. Generate a comprehensive medical risk assessment report in a clean, professional paragraph format suitable for a clinical document.

PATIENT INFORMATION:
- Name: ${data.patientName}
- Condition of Interest: ${data.conditionName || data.condition}
- Calculated Genetic Risk: ${data.totalRisk}%
- Risk Classification: ${data.riskLevel}

FAMILY MEDICAL HISTORY:
${familyHistoryDetails}

CRITICAL FORMATTING REQUIREMENTS:
- Write in flowing paragraphs, NOT bullet points
- Use professional medical language
- Each section should have 2-4 well-developed paragraphs
- No markdown formatting (no **, ##, or bullet points)
- Clean, readable text suitable for a PDF document
- Professional clinical tone throughout

Generate a report with these sections:

Executive Summary

Write 2-3 paragraphs explaining that this report provides a comprehensive overview of ${data.patientName}'s hereditary risk for ${data.conditionName || data.condition}. The calculated genetic risk is ${data.totalRisk}%, placing the patient in the ${data.riskLevel} category. Explain that elevated risk does not imply certainty but suggests higher probability than average. Emphasize that early awareness and preventive care can significantly improve outcomes. Mention the pattern of affected relatives across generations.

Genetic Risk Analysis

Write 3-4 paragraphs explaining the inheritance pattern for ${data.conditionName || data.condition}. Describe how family history shows affected relatives across generations. Explain each affected family member's contribution: ${familyHistoryDetails}. Discuss how each generation contributes to risk (parents 50%, grandparents 25%, etc.). Explain the clustering of cases and what this suggests about genetic contribution versus coincidence.

Disease Overview

Write 2-3 paragraphs describing ${data.conditionName || data.condition} in medical terms. Explain the biological mechanism and how it develops. Describe warning signs and symptoms. Provide population baseline risk statistics and compare with hereditary risk levels. Explain how family history increases individual risk.

Personalized Risk Assessment

Write 2-3 paragraphs interpreting the ${data.totalRisk}% risk specifically for this patient. Compare to population baseline. Emphasize that this is probability, not certainty. Explain that many high-risk individuals remain healthy with proper screening and lifestyle optimization. Discuss what this risk level means for health planning.

Preventive Measures and Lifestyle Modifications

Write 3-4 paragraphs with specific recommendations. Discuss balanced diet rich in fruits, vegetables, and lean proteins. Recommend limiting refined sugars, processed foods, and alcohol. Suggest at least 150 minutes of moderate weekly exercise. Emphasize maintaining healthy body weight, avoiding tobacco, prioritizing adequate sleep, and stress management. Explain that lifestyle cannot eliminate inherited risk but significantly improves resilience and supports early detection.

Medical Screening Recommendations

Write 2-3 paragraphs listing specific screening protocols. Recommend annual clinical examinations and age-appropriate imaging. Suggest genetic counselor referral for testing. Mention specific biomarker tests if relevant. Recommend specialist consultations. Emphasize that screening frequency should be personalized with healthcare providers. Suggest starting screening 10 years before youngest family diagnosis age.

Medication and Treatment Considerations

Write 2 paragraphs discussing preventive pharmacologic options if applicable. Explain that treatment decisions should balance benefits, risks, and side effects under physician guidance. Mention that some medications can reduce risk by 30-50% in appropriate candidates. Emphasize the importance of medical supervision.

Family Planning Considerations

Write 2 paragraphs explaining that genetic conditions are inheritable and children may carry risk. Discuss genetic counseling benefits including pre-conception risk discussions, carrier screening options, prenatal testing considerations, and family communication strategies. Emphasize informed decision-making and support resources.

Monitoring and Follow-Up

Write 2-3 paragraphs creating a monitoring schedule. Recommend annual comprehensive health evaluations and adherence to screening intervals. Suggest immediate consultation for persistent symptoms. Emphasize periodic reassessment as family history evolves and documentation of newly diagnosed family members. Stress the importance of long-term vigilance and proactive care.

Conclusion and Action Plan

Write 2-3 paragraphs summarizing that ${data.patientName} has ${data.riskLevel.toLowerCase()} hereditary risk for ${data.conditionName || data.condition}. Emphasize that awareness, screening, and preventive care are essential. State that with appropriate medical guidance, individuals in this risk category frequently maintain long, healthy lives. Provide clear next steps: schedule consultation with genetic counselor, establish personalized screening plan, maintain healthy lifestyle behaviors, and reassess risk periodically. End with disclaimer about informational purposes only.

CRITICAL: Write in flowing paragraphs with NO bullet points, NO markdown formatting, NO asterisks or special characters. Just clean, professional medical prose suitable for a clinical document.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return {
      success: true,
      report: text,
      error: null,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.log('→ Switching to fallback report generation...');
    const { generateFallbackReport } = require('./fallbackReportService');
    return generateFallbackReport(data);
  }
};

module.exports = { generateRiskReport };
