// Fallback report generation when Gemini API is not available

const generateFallbackReport = (data) => {
  const { patientName, conditionName, condition, totalRisk, riskLevel, affectedAncestors } = data;
  const conditionText = conditionName || condition;
  
  const report = `
**GENETIC RISK ASSESSMENT REPORT**

**Patient:** ${patientName}
**Condition:** ${conditionText}
**Calculated Risk:** ${totalRisk}%
**Risk Classification:** ${riskLevel}

---

**EXECUTIVE SUMMARY**

Based on your family medical history, you have a ${totalRisk}% calculated genetic risk for ${conditionText}. This is classified as a ${riskLevel} risk level. This assessment is based on the presence of ${affectedAncestors.length} affected family member(s) across ${Math.max(...affectedAncestors.map(a => a.generation))} generation(s).

---

**FAMILY MEDICAL HISTORY**

The following family members have been diagnosed with ${conditionText}:

${affectedAncestors.map(a => {
  const generationName = {
    1: 'Parent',
    2: 'Grandparent',
    3: 'Great-grandparent',
    4: 'Great-great-grandparent'
  }[a.generation] || 'Ancestor';
  return `• ${a.name} (${generationName}) - ${a.risk}% genetic contribution`;
}).join('\n')}

---

**GENETIC RISK ANALYSIS**

Your ${totalRisk}% risk is calculated based on the genetic contribution from each affected family member:
- Parents contribute 50% of genetic risk
- Grandparents contribute 25% of genetic risk
- Great-grandparents contribute 12.5% of genetic risk
- Great-great-grandparents contribute 6.25% of genetic risk

${riskLevel === 'High' ? `
**HIGH RISK INTERPRETATION:**
A risk level above 50% indicates a significant family history of ${conditionText}. This suggests a strong genetic component and warrants proactive health management and regular screening.
` : riskLevel === 'Medium' ? `
**MEDIUM RISK INTERPRETATION:**
A risk level between 25-50% indicates a moderate family history of ${conditionText}. While not as high as some cases, this still warrants attention and preventive measures.
` : `
**LOW RISK INTERPRETATION:**
A risk level below 25% indicates a limited family history of ${conditionText}. However, any family history is worth noting and discussing with your healthcare provider.
`}

---

**DISEASE OVERVIEW: ${conditionText}**

${conditionText} is a medical condition that can have genetic components. Family history is an important risk factor, as genetic predisposition can increase the likelihood of developing this condition.

**Common Risk Factors:**
• Family history (genetic predisposition)
• Age and lifestyle factors
• Environmental exposures
• Other health conditions

**Early Warning Signs:**
Consult with your healthcare provider to understand the specific symptoms and warning signs of ${conditionText}.

---

**PREVENTIVE MEASURES & LIFESTYLE MODIFICATIONS**

${riskLevel === 'High' ? `
**For High-Risk Individuals:**
1. **Regular Screening:** Schedule comprehensive screenings at least annually
2. **Lifestyle Changes:** Adopt preventive lifestyle modifications immediately
3. **Medical Consultation:** Consult with a specialist for personalized prevention plan
4. **Genetic Counseling:** Consider genetic testing and counseling
5. **Family Communication:** Inform other family members about the family history
` : riskLevel === 'Medium' ? `
**For Medium-Risk Individuals:**
1. **Regular Monitoring:** Schedule screenings every 1-2 years
2. **Healthy Lifestyle:** Maintain a balanced diet and regular exercise
3. **Medical Check-ups:** Annual physical examinations
4. **Risk Reduction:** Focus on modifiable risk factors
5. **Stay Informed:** Keep updated on latest prevention strategies
` : `
**For Low-Risk Individuals:**
1. **Routine Screening:** Follow standard screening guidelines
2. **Healthy Habits:** Maintain general health and wellness
3. **Awareness:** Stay aware of family history
4. **Regular Check-ups:** Annual health assessments
5. **Prevention:** Focus on overall health maintenance
`}

**General Recommendations:**
• Maintain a healthy weight
• Exercise regularly (at least 150 minutes per week)
• Eat a balanced, nutritious diet
• Avoid smoking and limit alcohol consumption
• Manage stress through relaxation techniques
• Get adequate sleep (7-9 hours per night)
• Stay hydrated

---

**MEDICAL SCREENING RECOMMENDATIONS**

**Recommended Tests:**
• Baseline screening for ${conditionText}
• Regular monitoring based on risk level
• Additional tests as recommended by your physician

**Screening Frequency:**
${riskLevel === 'High' ? '• Annual comprehensive screening' : riskLevel === 'Medium' ? '• Screening every 1-2 years' : '• Follow standard screening guidelines'}

**When to Start:**
• Discuss with your healthcare provider
• Generally, screening should begin 10 years before the youngest age of diagnosis in your family
• Or at age 40, whichever comes first

**Specialist Consultations:**
• Primary care physician for overall health management
• Specialist in ${conditionText} for targeted care
• Genetic counselor for family planning considerations

---

**MONITORING & FOLLOW-UP**

**Regular Monitoring Schedule:**
1. **Annual Physical Examination:** Comprehensive health assessment
2. **Condition-Specific Screening:** Based on your risk level
3. **Lifestyle Assessment:** Review and adjust preventive measures
4. **Family History Update:** Track any new diagnoses in family members

**When to Seek Immediate Medical Attention:**
• Any symptoms associated with ${conditionText}
• Sudden changes in health status
• Concerns about your risk or family history

---

**FAMILY PLANNING CONSIDERATIONS**

If you are planning to have children, consider:
• Genetic counseling to understand inheritance patterns
• Discussion with your partner about family medical history
• Prenatal testing options if applicable
• Planning for potential health monitoring of children

---

**CONCLUSION & ACTION PLAN**

**Key Takeaways:**
1. You have a ${totalRisk}% (${riskLevel}) genetic risk for ${conditionText}
2. ${affectedAncestors.length} family member(s) have been diagnosed with this condition
3. Proactive health management can significantly reduce your risk
4. Regular screening and healthy lifestyle are essential

**Immediate Action Steps:**
1. ✓ Schedule an appointment with your primary care physician
2. ✓ Discuss this risk assessment with your doctor
3. ✓ Begin implementing lifestyle modifications
4. ✓ Schedule appropriate screening tests
5. ✓ Consider genetic counseling if planning a family
6. ✓ Inform close family members about the family history

**Long-Term Management:**
• Maintain regular medical follow-ups
• Continue healthy lifestyle practices
• Stay informed about ${conditionText}
• Update your family medical history regularly
• Advocate for your health proactively

---

**IMPORTANT DISCLAIMER**

This report is for informational purposes only and should not be considered as medical advice, diagnosis, or treatment. The risk calculations are based on family history and do not account for other factors such as lifestyle, environment, or other genetic factors. 

Please consult with qualified healthcare professionals for:
• Personalized medical advice
• Accurate diagnosis
• Treatment recommendations
• Genetic testing and counseling

Your healthcare provider can provide guidance specific to your individual circumstances and help you develop a comprehensive health management plan.

---

**Report Generated:** ${new Date().toISOString()}
**Risk Assessment Tool:** Heredity - Interactive Family Health Tree

For questions or concerns about this report, please consult with your healthcare provider.
`;

  return {
    success: true,
    report: report.trim(),
    error: null,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

module.exports = { generateFallbackReport };
