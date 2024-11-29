import { Strength, DevelopmentSuggestion } from '../types/strength';

const CLAUDE_API_KEY = 'sk-5Kuf615hoq4lG7nNLs2FNcgV5rPnHSP5oPOVc0IL8zFoqrzX';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface ClaudeResponse {
  content: string[];
}

export const analyzeWithClaude = async (strengths: Strength[]): Promise<DevelopmentSuggestion> => {
  try {
    const prompt = `
      作为一位专业的职业发展顾问，请基于以下能力特质数据，提供详细的发展建议：
      
      ${strengths.map(s => `${s.rank}. ${s.name}(${s.category}): ${s.coefficient}`).join('\n')}
      
      请从以下几个方面提供建议：
      1. 优势发挥（如何充分利用前10名的优势特质）
      2. 短板提升（如何应对排名靠后的特质）
      3. 未来展望（基于这些特质的发展方向）
      4. 职业发展建议（适合的职业方向和岗位）
      5. 能力提升重点（需要重点培养的能力）
      6. 具体行动建议（可以立即采取的行动）
      
      请确保建议具体、可行、有针对性。每个方面提供3-4点建议。
    `;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240320',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API 请求失败');
    }

    const data = await response.json();
    const suggestions = parseSuggestions(data.content);

    return suggestions;
  } catch (error) {
    console.error('Claude 分析错误:', error);
    return getDefaultSuggestions();
  }
};

const parseSuggestions = (content: string): DevelopmentSuggestion => {
  // 这里应该解析 Claude 的响应，提取各个建议
  // 为了演示，这里返回默认建议
  return getDefaultSuggestions();
};

const getDefaultSuggestions = (): DevelopmentSuggestion => {
  return {
    strengthsUtilization: [
      "发挥您的核心优势",
      "在工作中主动承担相关任务",
      "建立基于优势的工作方法"
    ],
    weaknessImprovement: [
      "正确认识并接纳短板",
      "寻找互补的合作伙伴",
      "适度提升必要的能力"
    ],
    futureOutlook: [
      "选择适合的发展方向",
      "持续强化核心才干",
      "建立独特竞争优势"
    ],
    careerDevelopment: [
      "选择匹配的岗位",
      "打造个人特色",
      "发展领导力"
    ],
    keyCompetencies: [
      "提升核心能力",
      "培养整合能力",
      "加强沟通技巧"
    ],
    actionItems: [
      "制定发展计划",
      "寻找实践机会",
      "建立反馈机制"
    ]
  };
}; 