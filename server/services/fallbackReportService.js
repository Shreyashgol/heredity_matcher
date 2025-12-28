const generateFallbackReport = (data) => {
  const { patientName, conditionName, condition, totalRisk, riskLevel, affectedAncestors } = data;
  const conditionText = conditionName || condition;
  
  const familyHistoryText = affectedAncestors.map((a, index) => {
    const generationName = {
      1: 'Parent',
      2: 'Grandparent',
      3: 'Great-grandparent',
      4: 'Great-great-grandparent'
    }[a.generation] || 'Ancestor';
    return `${index + 1}. ${a.name} (${generationName}) - ${a.risk}% contribution`;
  }).join('\n');
  
  const report = `Genetic Risk Assessment Report

Confidential Medical Document

Patient: ${patientName}
Condition: ${conditionText}
Calculated Genetic Risk: ${totalRisk}%
Risk Classification: ${riskLevel}


Executive Summary

This report provides a comprehensive overview of ${patientName}'s hereditary risk for ${conditionText} based on documented family medical history. The calculated genetic risk is ${totalRisk}%, placing the patient in the ${riskLevel} category compared with the general population. An elevated risk does not imply certainty of disease development. Instead, it suggests that ${patientName} has a significantly higher probability than average and would benefit from proactive screening, preventive strategies, and consultation with a genetic counselor or specialist.

The combination of affected relatives across ${Math.max(...affectedAncestors.map(a => a.generation))} generation(s) indicates a pattern consistent with hereditary inheritance. Early awareness is a powerful protective factor, and timely preventive care can significantly improve long-term outcomes. The presence of ${affectedAncestors.length} affected family member(s) creates a cumulative risk that warrants careful monitoring and preventive action.


Genetic Risk Analysis

${conditionText} can have significant genetic components, and understanding family history helps assess the likelihood of genetic contribution. When multiple family members are affected across generations, it suggests that inherited factors may play an important role in disease development. ${patientName}'s family history indicates the following affected relatives: ${familyHistoryText.replace(/\n/g, '; ')}.

The clustering of cases across multiple generations strengthens the likelihood of genetic contribution rather than coincidence. Each generation contributes to the overall risk calculation based on genetic proximity. Parents, as first-degree relatives, contribute approximately 50% of genetic material. Grandparents, as second-degree relatives, contribute approximately 25%. Great-grandparents contribute 12.5%, and great-great-grandparents contribute 6.25%. The cumulative effect of multiple affected family members results in the calculated ${totalRisk}% risk.

This pattern of inheritance suggests that ${patientName} may have inherited genetic variants that increase susceptibility to ${conditionText}. While not all individuals with family history will develop the condition, the presence of multiple affected relatives across generations indicates a familial predisposition that warrants enhanced surveillance and preventive measures.


Disease Overview

${conditionText} is a medical condition that can have substantial genetic components. When multiple family members are affected, it suggests that inherited factors may play a crucial role in disease development. The condition can manifest through various mechanisms, and family history serves as an important indicator of individual risk. Understanding the genetic basis helps inform screening recommendations and preventive strategies.

Warning signs of familial predisposition include multiple affected relatives, earlier age of onset in family members, and cases spanning multiple generations. The general population risk varies by condition, but family history can increase individual risk by two to five times or more, depending on the number and proximity of affected relatives. Individuals with strong family histories may face substantially higher lifetime risks and should work closely with healthcare providers to develop appropriate screening and prevention strategies.

Early detection through regular screening dramatically improves treatment outcomes and survival rates for most conditions. Understanding personal risk based on family history allows for earlier intervention and more targeted preventive care.


Personalized Risk Assessment

${patientName}'s estimated ${totalRisk}% risk reflects ${riskLevel.toLowerCase()} hereditary patterns in the family ancestry. Compared with baseline population risk, this probability is notably elevated. ${riskLevel === 'Very High' || riskLevel === 'High' ? `This high-risk classification indicates that ${patientName} should prioritize aggressive screening and preventive measures. However, this does not guarantee disease development. Many high-risk individuals remain healthy, especially when supported by comprehensive screening and lifestyle optimization.` : riskLevel === 'Moderate' || riskLevel === 'Medium' ? `This moderate-risk classification suggests that ${patientName} should maintain regular screening and adopt preventive lifestyle measures. While the risk is elevated, proactive management can significantly reduce the likelihood of disease development.` : `This risk level, while elevated above baseline, is manageable with appropriate screening and healthy lifestyle choices. Regular monitoring and preventive care remain important.`}

Risk assessment is not deterministic—it represents probability based on family history. Environmental factors, lifestyle choices, and other genetic factors also play important roles in disease development. The calculated risk provides guidance for screening frequency and preventive strategies but does not predict individual outcomes with certainty. Many individuals with elevated genetic risk never develop the condition, particularly when they engage in proactive health management and regular monitoring.


Preventive Measures and Lifestyle Modifications

Lifestyle modifications play a crucial role in managing genetic risk. A balanced diet rich in fruits, vegetables, whole grains, and lean proteins provides essential nutrients and supports overall health. Limiting refined sugars, processed foods, and excessive alcohol consumption reduces additional risk factors. Regular physical activity, including at least 150 minutes of moderate-intensity aerobic exercise weekly, helps maintain healthy body weight and reduces disease risk.

Maintaining a healthy body weight with a BMI between 18.5 and 24.9 is particularly important for individuals with genetic predisposition. Avoiding all tobacco products and secondhand smoke exposure eliminates a major modifiable risk factor. Adequate sleep of seven to nine hours nightly supports immune function and overall health. Stress management through meditation, yoga, or other relaxation techniques helps reduce physiological stress that can contribute to disease development.

Staying well-hydrated and limiting exposure to environmental toxins when possible further supports health. While lifestyle changes cannot eliminate inherited risk, research consistently shows that healthy lifestyle choices can reduce disease risk by 30-50% even in genetically predisposed individuals. These modifications significantly improve overall health resilience and support early detection of potential health issues.


Medical Screening Recommendations

Given the ${riskLevel.toLowerCase()} risk classification, comprehensive screening protocols are recommended. Annual physical examinations with a primary care physician provide baseline monitoring and allow for early detection of concerning changes. Age-appropriate diagnostic imaging as advised by healthcare providers helps identify potential issues before symptoms develop. Referral to a certified genetic counselor for comprehensive risk assessment can provide valuable insights into specific genetic factors and testing options.

Consideration of genetic testing to identify specific mutations may be appropriate, particularly for conditions with well-characterized genetic markers. Condition-specific biomarker testing at regular intervals allows for monitoring of relevant health indicators. Specialist consultation with an oncologist, cardiologist, or other relevant specialist provides expert guidance tailored to the specific condition. Baseline screening should ideally begin ten years before the youngest age of diagnosis in the family, or at an age recommended by healthcare providers based on individual circumstances.

${riskLevel === 'Very High' || riskLevel === 'High' ? `For high-risk individuals, screening should begin earlier and occur more frequently than standard guidelines recommend. Annual or semi-annual monitoring may be appropriate depending on the specific condition and individual risk factors.` : `Screening frequency should be personalized in consultation with healthcare providers based on individual circumstances and family history patterns.`} Early detection through regular screening dramatically improves treatment outcomes and survival rates for most conditions.


Medication and Treatment Considerations

Preventive pharmacologic options may be appropriate for certain individuals with elevated genetic risk. Risk-reducing medications specific to the condition, chemoprevention agents that may lower disease incidence, and supplements or medications that support overall health can all play roles in comprehensive risk management. However, any treatment decision should carefully balance potential benefits against risks and side effects.

Preventive medications are not appropriate for everyone and should only be considered under close physician supervision. Some preventive interventions have been shown to reduce disease risk by 30-50% in appropriate candidates. These decisions are highly individualized and require thorough discussion with qualified healthcare providers who can assess personal risk factors, medical history, and potential contraindications. The decision to pursue preventive medication should be made collaboratively between patient and physician, considering individual circumstances and preferences.


Family Planning Considerations

Because genetic conditions can be inheritable, children may also carry increased risk. Genetic counseling can provide valuable support for individuals and families navigating these complex decisions. Pre-conception risk assessment and planning discussions help prospective parents understand potential risks to future children. Carrier screening options for both partners can identify whether both carry genetic variants that could be passed to offspring.

Understanding inheritance patterns and probability helps families make informed decisions about family planning. Consideration of prenatal testing where appropriate provides options for early detection. Family communication strategies about genetic risk help relatives understand their own potential risks. Psychological support for family planning decisions addresses the emotional aspects of genetic risk. Genetic counselors are specially trained professionals who can help individuals and families understand complex genetic information and make informed decisions about testing, screening, and family planning.


Monitoring and Follow-Up

A proactive monitoring schedule is strongly advised for individuals with elevated genetic risk. Annual comprehensive health evaluations with a primary care provider establish baseline health status and allow for early detection of changes. Strict adherence to recommended screening intervals ensures that potential issues are identified as early as possible. Immediate medical consultation for persistent or concerning symptoms allows for prompt evaluation and intervention when needed.

Regular review and update of family medical history helps track evolving risk patterns. Documentation of any newly diagnosed family members provides important information for risk reassessment. Periodic reassessment of risk as family history evolves ensures that screening protocols remain appropriate. Maintenance of personal health records and screening results facilitates continuity of care and informed decision-making.

Long-term vigilance is essential for optimal health outcomes. Many conditions are highly treatable when detected early, making consistent monitoring one of the most important protective factors for high-risk individuals. Patients should maintain open communication with their healthcare team and report any changes in health status promptly.


Conclusion and Action Plan

${patientName} has a ${riskLevel.toLowerCase()} hereditary risk for ${conditionText} based on family medical history. Awareness, ongoing screening, and preventive care remain essential components of health management. With appropriate medical guidance and proactive health behaviors, individuals in this risk category frequently maintain long, healthy, and productive lives. The calculated risk provides important information for health planning but does not determine individual outcomes.

Recommended next steps include scheduling a consultation with a certified genetic counselor to discuss comprehensive risk assessment and potential genetic testing options. Establishing a personalized screening plan with a primary care physician and relevant specialists ensures appropriate frequency and types of monitoring. Implementing and maintaining healthy lifestyle behaviors including balanced nutrition, regular physical activity, stress management, and adequate sleep reduces modifiable risk factors. Reassessing risk periodically as family history evolves, documenting any new diagnoses among family members, and adjusting screening protocols accordingly maintains optimal vigilance.

Considering sharing this information with close family members who may also benefit from risk assessment and preventive care extends the value of this assessment beyond the individual. Maintaining detailed personal health records including all screening results, family history updates, and medical consultations facilitates comprehensive care coordination. This document is intended for informational purposes only and should not replace professional medical evaluation or treatment recommendations. All medical decisions should be made in consultation with qualified healthcare professionals who can provide personalized guidance based on complete medical history, physical examination, and appropriate diagnostic testing.


Report Generated: ${new Date().toLocaleString()}
Assessment Tool: Heredity - Interactive Family Health Tree`;

  return {
    success: true,
    report: report.trim(),
    error: null,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

module.exports = { generateFallbackReport };
