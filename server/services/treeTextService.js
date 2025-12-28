const generateTreeTextRepresentation = (treeData, patientName) => {
  if (!treeData || treeData.length === 0) {
    return 'No family tree data available';
  }

  // Group by generation
  const generations = {};
  treeData.forEach(person => {
    if (!generations[person.generation_level]) {
      generations[person.generation_level] = [];
    }
    generations[person.generation_level].push(person);
  });

  // Build text representation
  let treeText = '';
  const sortedGenerations = Object.keys(generations)
    .map(Number)
    .sort((a, b) => b - a); // Reverse order (ancestors first)

  sortedGenerations.forEach((genLevel, index) => {
    const generationName = {
      0: 'Current Generation (You)',
      1: 'Parents',
      2: 'Grandparents',
      3: 'Great-Grandparents',
      4: 'Great-Great-Grandparents'
    }[genLevel] || `Generation ${genLevel}`;

    treeText += `\n${'═'.repeat(60)}\n`;
    treeText += `${generationName}\n`;
    treeText += `${'═'.repeat(60)}\n`;

    generations[genLevel].forEach((person, idx) => {
      const hasConditions = person.conditions && person.conditions.length > 0;
      const isPatient = person.name === patientName;
      
      let personLine = `${idx + 1}. ${person.name}`;
      
      if (isPatient) {
        personLine += ' ⭐ (Current Patient)';
      }
      
      personLine += ` [${person.gender}]`;
      
      if (hasConditions) {
        personLine += ' [CONDITIONS]';
      }
      
      treeText += `\n${personLine}\n`;
      
      if (person.birth_date) {
        treeText += `   Birth Date: ${person.birth_date}\n`;
      }
      
      if (hasConditions) {
        treeText += `   Medical Conditions:\n`;
        person.conditions.forEach(condition => {
          treeText += `   • ${condition.condition_name}`;
          if (condition.diagnosed_date) {
            treeText += ` (Diagnosed: ${condition.diagnosed_date})`;
          }
          treeText += '\n';
        });
      }
    });
  });

  return treeText;
};


const generateFamilyTreeSummary = (treeData, patientName, condition) => {
  if (!treeData || treeData.length === 0) {
    return 'No family tree data available';
  }

  let summary = `\nFAMILY TREE ANALYSIS FOR: ${patientName}\n`;
  summary += `CONDITION OF INTEREST: ${condition}\n`;
  summary += `${'═'.repeat(60)}\n\n`;

  // Count statistics
  const totalMembers = treeData.length;
  const withConditions = treeData.filter(p => 
    p.conditions && p.conditions.some(c => c.condition_name === condition)
  ).length;
  
  const generations = {};
  treeData.forEach(person => {
    if (!generations[person.generation_level]) {
      generations[person.generation_level] = [];
    }
    generations[person.generation_level].push(person);
  });

  summary += `FAMILY STATISTICS:\n`;
  summary += `• Total Family Members: ${totalMembers}\n`;
  summary += `• Members with ${condition}: ${withConditions}\n`;
  summary += `• Number of Generations: ${Object.keys(generations).length}\n\n`;

  // Generation breakdown
  summary += `GENERATION BREAKDOWN:\n`;
  Object.keys(generations)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach(genLevel => {
      const genName = {
        0: 'Current Generation',
        1: 'Parents',
        2: 'Grandparents',
        3: 'Great-Grandparents',
        4: 'Great-Great-Grandparents'
      }[genLevel] || `Generation ${genLevel}`;
      
      const count = generations[genLevel].length;
      const withCond = generations[genLevel].filter(p =>
        p.conditions && p.conditions.some(c => c.condition_name === condition)
      ).length;
      
      summary += `• ${genName}: ${count} members (${withCond} with ${condition})\n`;
    });

  summary += `\n${'═'.repeat(60)}\n`;

  return summary;
};

module.exports = {
  generateTreeTextRepresentation,
  generateFamilyTreeSummary
};
