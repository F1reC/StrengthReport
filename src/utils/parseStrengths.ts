export const parseStrengthsText = (text: string) => {
  // 移除页码和URL等无关信息
  const cleanText = text.replace(/https?:\/\/[^\s]+/g, '')
                       .replace(/页码#\s*\d+\/\d+/g, '')
                       .replace(/\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}/g, '');
  
  // 分割文本为行
  const lines = cleanText.split('\n')
    .filter(line => line.trim())
    .filter(line => !line.startsWith('您的优势识别器'))
    .filter(line => !line.includes('位数 名称 分类'));

  const strengths: any[] = [];
  const validCategories = ['战略思维', '关系建立', '影响力', '执行力'];
  
  let currentStrength: any = {};
  
  for (let line of lines) {
    // 匹配每个优势的基本信息
    const basicMatch = line.match(/^(\d+)\s+(\S+)\s+(\S+)\s+(.+?)\s+([\d.]+)$/);
    
    if (basicMatch) {
      const [_, rank, name, category, description, coefficient] = basicMatch;
      
      // 标准化分类名称
      const normalizedCategory = validCategories.find(
        c => c === category || category.includes(c)
      ) || '其他';
      
      currentStrength = {
        rank: parseInt(rank),
        name: name.trim(),
        category: normalizedCategory,
        description: description.trim()
          .replace(/["""]/g, '') // 移除中文引号
          .replace(/\s+/g, ' '), // 规范化空格
        coefficient: parseFloat(coefficient)
      };
      
      strengths.push(currentStrength);
    } else if (line.trim() && currentStrength) {
      // 如果是描述的延续部分，附加到当前优势的描述中
      currentStrength.description += ' ' + line.trim()
        .replace(/["""]/g, '')
        .replace(/\s+/g, ' ');
    }
  }
  
  // 按系数排序
  return strengths.sort((a, b) => b.coefficient - a.coefficient);
};