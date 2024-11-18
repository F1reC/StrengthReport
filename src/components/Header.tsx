import React from 'react';
import { FileText, Printer } from 'lucide-react';

interface HeaderProps {
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => (
  <>
    <div className="fixed top-4 right-4 print:hidden">
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Printer size={20} />
        打印报告
      </button>
    </div>

    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <FileText size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">盖洛普优势识别器 2.0</h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        基于盖洛普34项优势主题的专业分析，帮助您发现并发挥核心天赋优势。
        通过科学的评估方法，为您提供个性化的优势发展建议。
      </p>
    </div>
  </>
);