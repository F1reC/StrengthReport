export const parseStrengthsText = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim());
  const strengths: any[] = [];
  
  const validCategories = ['战略思维', '关系建立', '影响力', '执行力'];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/(\d+)\s+(\S+)\s+(\S+)\s+(.+)/);
    
    if (match) {
      const [_, rank, name, category, rest] = match;
      const coefficientMatch = rest.match(/(\d+\.\d+)/);
      const coefficient = coefficientMatch ? parseFloat(coefficientMatch[1]) : 0;
      const description = rest.replace(/\d+\.\d+/, '').trim();
      
      // Normalize category name to ensure it matches our defined categories
      const normalizedCategory = validCategories.find(
        c => c === category || category.includes(c)
      ) || '其他';
      
      strengths.push({
        rank: parseInt(rank),
        name,
        category: normalizedCategory,
        coefficient,
        description
      });
    }
  }
  
  return strengths;
};