import React, { useRef, useState } from 'react';
import { Brain, Users, Zap, Target } from 'lucide-react';
import { Header } from './components/Header';
import { StrengthInput } from './components/StrengthInput';
import { CategoryOverview } from './components/CategoryOverview';
import { StrengthsList } from './components/StrengthsList';
import { parseStrengthsText } from './utils/parseStrengths';
import { Strength, StrengthCategories } from './types/strength';
import { ReportOverview } from './components/ReportOverview';

const strengthCategories: StrengthCategories = {
  '战略思维': {
    icon: Brain,
    color: 'bg-blue-100 text-blue-800',
    description: '关注思考和分析的能力，善于收集信息、学习和战略规划。'
  },
  '关系建立': {
    icon: Users,
    color: 'bg-green-100 text-green-800',
    description: '建立和维护人际关系的能力，包括同理心和团队协作。'
  },
  '影响力': {
    icon: Zap,
    color: 'bg-purple-100 text-purple-800',
    description: '影响他人思想和行为的能力，包括领导力和说服力。'
  },
  '执行力': {
    icon: Target,
    color: 'bg-orange-100 text-orange-800',
    description: '将想法转化为行动的能力，包括组织、规划和实施。'
  }
};

function App() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleAnalyze = (text: string) => {
    const parsedStrengths = parseStrengthsText(text);
    setStrengths(parsedStrengths);
    setHasAnalysis(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={reportRef} className="max-w-5xl mx-auto p-8 print:p-4">
        <Header onPrint={handlePrint} />
        
        <StrengthInput onAnalyze={handleAnalyze} />

        {hasAnalysis && (
          <>
            <ReportOverview strengths={strengths} />
            <CategoryOverview 
              categories={strengthCategories}
              strengths={strengths}
            />
            <StrengthsList 
              strengths={strengths}
              categories={strengthCategories}
            />
          </>
        )}

        {/* 打印样式 */}
        <style>{`
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            @page {
              size: A4;
              margin: 1cm;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;