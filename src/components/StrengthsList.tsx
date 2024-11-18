import React from 'react';
import { Strength, StrengthCategories } from '../types/strength';

interface StrengthsListProps {
  strengths: Strength[];
  categories: StrengthCategories;
}

export const StrengthsList: React.FC<StrengthsListProps> = ({ strengths, categories }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">详细优势分析</h2>
    <div className="space-y-8">
      {strengths.map((strength) => {
        const categoryInfo = categories[strength.category];
        const categoryColor = categoryInfo?.color || 'bg-gray-100 text-gray-800';

        return (
          <div key={strength.rank} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">#{strength.rank}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{strength.name}</h3>
                  <span className={`text-sm px-3 py-1 rounded-full ${categoryColor}`}>
                    {strength.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-600">
                  系数: {strength.coefficient.toFixed(3)}
                </span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{strength.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              <h4 className="font-medium mb-2">发展建议：</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>充分发挥{strength.name}优势，在{strength.category}方面寻找发展机会</li>
                <li>寻找能够运用这项优势的具体场景和项目</li>
                <li>与他人分享您的{strength.name}见解，建立优势互补的合作关系</li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);