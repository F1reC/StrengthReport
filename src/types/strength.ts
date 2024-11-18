export interface Strength {
  rank: number;
  name: string;
  category: string;
  coefficient: number;
  description: string;
}

export interface CategoryInfo {
  icon: React.ComponentType;
  color: string;
  description: string;
}

export interface StrengthCategories {
  [key: string]: CategoryInfo;
}