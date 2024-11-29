import { 
  Strength, 
  StrengthReport, 
  VALID_STRENGTHS,
  ValidStrengthName,
  STRENGTH_ORDER,
  StrengthTier,
  CategoryAnalysis,
  STRENGTH_CATEGORIES,
  DevelopmentSuggestion
} from '../types/strength';

// 计算两个字符串的相似度
const calculateSimilarity = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return 1 - matrix[len1][len2] / Math.max(len1, len2);
};

// 找到最匹配的才干名称
const findClosestStrength = (name: string): ValidStrengthName | null => {
  // 首先尝试完全匹配
  if (STRENGTH_ORDER.includes(name as ValidStrengthName)) {
    return name as ValidStrengthName;
  }

  // 如果没有完全匹配，尝试模糊匹配
  let maxSimilarity = 0;
  let closestStrength: ValidStrengthName | null = null;

  for (const validName of STRENGTH_ORDER) {
    const similarity = calculateSimilarity(name, validName);
    if (similarity > maxSimilarity && similarity > 0.7) { // 提高相似度阈值
      maxSimilarity = similarity;
      closestStrength = validName;
    }
  }

  return closestStrength;
};

export const parseOCRText = (text: string): Strength[] => {
  console.log('原始OCR文本:', text);

  // 预处理文本
  const cleanedText = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes('位数') && !line.includes('系数'));
  
  console.log('清理后的文本行:', cleanedText);

  const strengths: Strength[] = [];
  const numberPattern = /^\d+/;
  const coefficientPattern = /([\d.]+)$/;

  for (let i = 0; i < cleanedText.length; i++) {
    const line = cleanedText[i].trim();
    
    if (!line || line.includes('名称') || line.includes('分类')) {
      continue;
    }

    if (numberPattern.test(line)) {
      console.log('处理行:', line);

      const rankMatch = line.match(/^(\d+)/);
      const coeffMatch = line.match(coefficientPattern);

      if (rankMatch && coeffMatch) {
        const rank = parseInt(rankMatch[1]);
        const coefficient = parseFloat(coeffMatch[1]);

        // 提取中间的文本并分割
        const middleText = line
          .substring(rankMatch[0].length, line.length - coeffMatch[0].length)
          .trim();
        
        // 尝试找到最匹配的才干名称
        const words = middleText.split(/\s+/);
        let strengthName = null;
        
        // 优先匹配完整的才干名称
        for (const word of words) {
          if (STRENGTH_ORDER.includes(word as ValidStrengthName)) {
            strengthName = word as ValidStrengthName;
            break;
          }
        }

        // 如果没有找到完全匹配，尝试模糊匹配
        if (!strengthName) {
          for (const word of words) {
            const matchedName = findClosestStrength(word);
            if (matchedName) {
              strengthName = matchedName;
              break;
            }
          }
        }

        if (strengthName && !isNaN(rank) && !isNaN(coefficient)) {
          const strength: Strength = {
            rank,
            name: strengthName,
            category: VALID_STRENGTHS[strengthName],
            description: middleText,
            coefficient
          };

          console.log('解析结果:', strength);
          strengths.push(strength);
        } else {
          console.warn('无法匹配才干名称:', middleText);
        }
      }
    }
  }

  // 验证结果
  const validStrengths = strengths
    .filter(s => STRENGTH_ORDER.includes(s.name as ValidStrengthName))
    .sort((a, b) => a.rank - b.rank);

  // 检查是否有重复的排名
  const rankSet = new Set(validStrengths.map(s => s.rank));
  if (rankSet.size !== validStrengths.length) {
    console.warn('发现重复的排名');
  }

  // 检查是否有重复的才干名称
  const nameSet = new Set(validStrengths.map(s => s.name));
  if (nameSet.size !== validStrengths.length) {
    console.warn('发现重复的才干名称');
  }

  console.log('最终解析结果数量:', validStrengths.length);
  return validStrengths;
};

const getStrengthTiers = (strengths: Strength[]): StrengthTier[] => {
  const tiers = [
    { range: "1-5", description: "最接近本能和下意识，是我们最依赖的、最高频使用的行为模式" },
    { range: "6-10", description: "大多数情况下都会使用、依赖的才干" },
    { range: "11-15", description: "有时候、在特定场合下、选择性地、需要刻意才能发挥的才干" },
    { range: "16-25", description: "使用起来无感的才干，既不厌恶也不喜欢" },
    { range: "26-34", description: "很少出现、甚至不会出现的特质，使用起来会感到痛苦" }
  ];

  return tiers.map(tier => {
    const [start, end] = tier.range.split("-").map(Number);
    return {
      range: tier.range,
      description: tier.description,
      strengths: strengths.filter(s => s.rank >= start && s.rank <= end)
    };
  });
};

const getCategoryAnalysis = (strengths: Strength[]): CategoryAnalysis[] => {
  const categories = Object.entries(STRENGTH_CATEGORIES).map(([key, value]) => ({
    category: value.name,
    description: value.description,
    strengths: strengths.filter(s => s.category === value.name),
    count: 0,
    averageCoefficient: 0
  }));

  categories.forEach(category => {
    category.count = category.strengths.length;
    category.averageCoefficient = category.strengths.reduce((sum, s) => sum + s.coefficient, 0) / category.count || 0;
  });

  return categories;
};

const getHeatmapData = (categoryAnalysis: CategoryAnalysis[]) => {
  return {
    categories: categoryAnalysis.map(c => c.category),
    values: categoryAnalysis.map(c => c.averageCoefficient)
  };
};

const generateDevelopmentSuggestions = (strengths: Strength[]): DevelopmentSuggestion => {
  // 获取前10名和后10名的特质
  const topStrengths = strengths.slice(0, 10);
  const weakStrengths = strengths.slice(-10);

  // 分析主导类别
  const categoryCount: { [key: string]: number } = {};
  strengths.forEach(s => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  });
  
  const dominantCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0][0];

  return {
    strengthsUtilization: [
      `充分发挥您的${topStrengths[0].name}、${topStrengths[1].name}等核心优势`,
      `在工作中多承担需要${topStrengths[0].category}的任务`,
      `建立基于${dominantCategory}的独特工作方法`,
      `寻找能够综合运用这些优势的机会`
    ],
    weaknessImprovement: [
      `正视并接纳${weakStrengths[0].name}、${weakStrengths[1].name}等特质的不足`,
      `寻找在${weakStrengths[0].category}方面的互补合作伙伴`,
      `适度提升必要的能力，但不需要强求完美`,
      `建立规避短板的工作策略和方法`
    ],
    futureOutlook: [
      `基于${dominantCategory}选择适合的发展方向`,
      `重点发展与${topStrengths[0].name}相关的专业领域`,
      `建立独特的个人品牌和竞争优势`,
      `寻找能发挥优势的发展机会`
    ],
    careerDevelopment: [
      `选择需要${dominantCategory}的岗位和行业`,
      `在职业发展中突出${topStrengths[0].name}、${topStrengths[1].name}等优势`,
      `避免对${weakStrengths[0].category}要求较高的岗位`,
      `建立基于优势的职业发展路径`
    ],
    keyCompetencies: [
      `进一步提升${topStrengths[0].name}的专业深度`,
      `加强${topStrengths[0].category}相关的能力培养`,
      `重点发展与主导特质相关的技能`,
      `建立个人的核心竞争力`
    ],
    actionItems: [
      `制定基于优势的个人发展计划`,
      `主动寻找发挥优势的实践机会`,
      `建立定期复盘和反馈的机制`,
      `持续积累和沉淀专业经验`
    ]
  };
};

export const generateReport = (strengths: Strength[]): StrengthReport => {
  const strengthTiers = getStrengthTiers(strengths);
  const categoryAnalysis = getCategoryAnalysis(strengths);
  const heatmap = getHeatmapData(categoryAnalysis);
  const developmentSuggestions = generateDevelopmentSuggestions(strengths);

  return {
    introduction: {
      purpose: "本报告基于盖洛普优势理论，帮助您科学认识自己的天赋潜能和行为模式。通过分析您的34项天赋主题，揭示您的行为倾向、思维模式和潜在优势。",
      benefits: [
        "识别个人天赋和潜在优势，发现独特的竞争力",
        "了解自己的行为模式和倾向，提高自我认知",
        "发现能量来源和驱动力，增强工作热情",
        "找到最适合的工作方式，提升效能",
        "改善人际关系，提升沟通效果",
        "优化职业发展方向，实现个人价值",
        "提升团队协作效能，发挥最大潜能"
      ]
    },
    strengthTiers,
    categoryAnalysis,
    heatmap,
    developmentSuggestions
  };
}; 