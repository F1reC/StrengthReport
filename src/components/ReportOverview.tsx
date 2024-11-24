import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReportOverviewProps {
  strengths: Strength[];
}

export const ReportOverview: React.FC<ReportOverviewProps> = ({ strengths }) => {
  const categoryCount = {
    '战略思维': strengths.filter(s => s.category === '战略思维').length,
    '关系建立': strengths.filter(s => s.category === '关系建立').length,
    '影响力': strengths.filter(s => s.category === '影响力').length,
    '执行力': strengths.filter(s => s.category === '执行力').length,
  };

  const data = {
    labels: Object.keys(categoryCount),
    datasets: [{
      data: Object.values(categoryCount),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)',
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">总体优势概述</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="max-w-xs mx-auto">
            <Doughnut data={data} options={{ cutout: '70%' }} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">核心优势 TOP5</h3>
          {strengths.slice(0, 5).map((strength, index) => (
            <div key={strength.name} className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{strength.name}</span>
                  <span className="text-sm text-gray-500">{strength.coefficient.toFixed(3)}</span>
                </div>
                <span className="text-sm text-gray-500">{strength.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 