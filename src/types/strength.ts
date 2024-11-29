export interface Strength {
  rank: number;
  name: string;
  category: string;
  description: string;
  coefficient: number;
}

export interface StrengthCategory {
  name: string;
  description: string;
  traits: string[];
}

export interface StrengthTier {
  range: string;
  description: string;
  strengths: Strength[];
}

export interface CategoryAnalysis {
  category: string;
  count: number;
  averageCoefficient: number;
  strengths: Strength[];
  description: string;
}

export interface DevelopmentSuggestion {
  strengthsUtilization: string[];
  weaknessImprovement: string[];
  futureOutlook: string[];
  careerDevelopment: string[];
  keyCompetencies: string[];
  actionItems: string[];
}

export interface StrengthReport {
  introduction: {
    purpose: string;
    benefits: string[];
  };
  strengthTiers: StrengthTier[];
  categoryAnalysis: CategoryAnalysis[];
  heatmap: {
    categories: string[];
    values: number[];
  };
  developmentSuggestions: DevelopmentSuggestion;
}

export const STRENGTH_CATEGORIES = {
  EXECUTION: {
    name: "执行力",
    description: "关注具体事物，擅长执行和落地细节",
    traits: ["精力充沛", "结果导向", "目标导向", "靠谱", "务实", "脚踏实地", "稳重", "谨慎", "有条理"]
  },
  INFLUENCE: {
    name: "影响力",
    description: "善于主导局面，影响他人想法",
    traits: ["有感染力", "有气场", "善于表达", "好胜", "强势", "有野心", "有说服力", "受欢迎"]
  },
  RELATIONSHIP: {
    name: "关系建立",
    description: "善于建立和维护人际关系",
    traits: ["亲和", "友善", "真诚", "善于倾听", "有耐心", "善解人意", "温暖", "安静"]
  },
  STRATEGIC: {
    name: "战略思维",
    description: "善于思考抽象概念和底层逻辑",
    traits: ["有洞察力", "分析能力强", "客观", "思维敏捷", "严谨", "逻辑好", "有想象力", "有批判性"]
  }
} as const;

export const STRENGTH_ORDER = [
  '理念', '前瞻', '个别', '行动', '搜集',
  '完美', '统筹', '思维', '学习', '竞争',
  '适应', '战略', '自信', '统率', '关联',
  '伯乐', '回顾', '追求', '信仰', '沟通',
  '排难', '积极', '专注', '取悦', '分析',
  '成就', '交往', '责任', '体谅', '包容',
  '审慎', '纪律', '和谐', '公平'
] as const;

export const VALID_STRENGTHS = {
  '理念': '战略思维',
  '前瞻': '战略思维',
  '个别': '关系建立',
  '行动': '影响力',
  '搜集': '战略思维',
  '完美': '影响力',
  '统筹': '执行力',
  '思维': '战略思维',
  '学习': '战略思维',
  '竞争': '影响力',
  '适应': '关系建立',
  '战略': '战略思维',
  '自信': '影响力',
  '统率': '影响力',
  '关联': '关系建立',
  '伯乐': '关系建立',
  '回顾': '战略思维',
  '追求': '影响力',
  '信仰': '执行力',
  '沟通': '影响力',
  '排难': '执行力',
  '积极': '关系建立',
  '专注': '执行力',
  '取悦': '影响力',
  '分析': '战略思维',
  '成就': '执行力',
  '交往': '关系建立',
  '责任': '执行力',
  '体谅': '关系建立',
  '包容': '关系建立',
  '审慎': '执行力',
  '纪律': '执行力',
  '和谐': '关系建立',
  '公平': '执行力'
} as const;

export type ValidStrengthName = keyof typeof VALID_STRENGTHS;