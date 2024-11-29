import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StrengthReport } from './components/StrengthReport';
import { parseOCRText, generateReport } from './services/strengthAnalyzer';
import { StrengthReport as IStrengthReport } from './types/strength';

function App() {
  const [processing, setProcessing] = useState(false);
  const [report, setReport] = useState<IStrengthReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOCRComplete = (text: string) => {
    try {
      const strengths = parseOCRText(text);
      if (strengths.length === 0) {
        setError('未能识别出有效的数据，请确保图片清晰并包含完整的表格信息');
        return;
      }
      const newReport = generateReport(strengths);
      setReport(newReport);
      setError(null);
    } catch (err) {
      setError('分析过程中出现错误，请重试');
      console.error('分析错误:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">能力特质分析报告</h1>
        
        <div className="mb-8">
          <ImageUploader
            onOCRComplete={handleOCRComplete}
            onProcessing={setProcessing}
          />
        </div>

        {processing && (
          <div className="text-center text-gray-600">
            正在处理图片，请稍候...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-4">
            {error}
          </div>
        )}

        {report && !processing && (
          <StrengthReport report={report} />
        )}
      </div>
    </div>
  );
}

export default App;