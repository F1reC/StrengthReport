import React from 'react';
import { StrengthReport as IStrengthReport } from '../types/strength';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StrengthReportProps {
  report: IStrengthReport;
}

export const StrengthReport: React.FC<StrengthReportProps> = ({ report }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '能力类别分布热力图'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 第一页：介绍 */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">使用说明</h2>
        <p className="text-gray-700 mb-4">{report.introduction.purpose}</p>
        <div className="space-y-2">
          {report.introduction.benefits.map((benefit, index) => (
            <div key={`benefit-${index}`} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 第二页：才干层级 */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">才干层级分析</h2>
        <div className="space-y-6">
          {report.strengthTiers.map((tier, tierIndex) => (
            <div key={`tier-${tier.range}`} className="border-b border-gray-100 pb-4 last:border-0">
              <h3 className="text-lg font-semibold mb-2">
                第{tier.range}层级：{tier.description}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tier.strengths.map((strength, strengthIndex) => (
                  <div 
                    key={`tier-${tierIndex}-strength-${strength.rank}`} 
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <span className="font-medium">{strength.name}</span>
                    <span className="text-blue-600">{strength.coefficient.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 第三页：类别分析 */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">能力类别分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.categoryAnalysis.map((category, categoryIndex) => (
            <div key={`category-${category.category}`} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{category.category}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>数量：{category.count}</span>
                  <span>平均系数：{category.averageCoefficient.toFixed(3)}</span>
                </div>
                <div className="space-y-1">
                  {category.strengths.map((strength, strengthIndex) => (
                    <div 
                      key={`category-${categoryIndex}-strength-${strength.rank}`}
                      className="text-sm flex justify-between"
                    >
                      <span>{strength.name}</span>
                      <span className="text-gray-600">{strength.coefficient.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 h-80">
          <Bar
            options={chartOptions}
            data={{
              labels: report.heatmap.categories,
              datasets: [
                {
                  data: report.heatmap.values,
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                }
              ]
            }}
          />
        </div>
      </section>

      {/* 第四页：发展建议 */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">发展建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">优势发挥</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.strengthsUtilization.map((item, index) => (
                  <li key={`strength-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">短板提升</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.weaknessImprovement.map((item, index) => (
                  <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">未来展望</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.futureOutlook.map((item, index) => (
                  <li key={`outlook-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">职业发展建议</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.careerDevelopment.map((item, index) => (
                  <li key={`career-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">能力提升重点</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.keyCompetencies.map((item, index) => (
                  <li key={`competency-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">行动建议</h3>
              <ul className="list-disc list-inside space-y-1">
                {report.developmentSuggestions.actionItems.map((item, index) => (
                  <li key={`action-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 