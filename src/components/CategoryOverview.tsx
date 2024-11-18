import React from 'react';
import { Strength, StrengthCategories } from '../types/strength';

interface CategoryOverviewProps {
  categories: StrengthCategories;
  strengths: Strength[];
}

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({ categories, strengths }) => {
  const getTopStrengthsByCategory = (category: string) => {
    return strengths
      .filter(s => s.category === category)
      .sort((a, b) => b.coefficient - a.coefficient)
      .slice(0, 3);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {Object.entries(categories).map(([category, { icon: Icon, color, description }]) => (
        <div key={category} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="space-y-3">
            {getTopStrengthsByCategory(category).map((strength) => (
              <div key={strength.name} className="flex items-center justify-between">
                <span className="text-gray-700">{strength.name}</span>
                <span className="text-sm font-medium text-gray-500">
                  {strength.coefficient.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};