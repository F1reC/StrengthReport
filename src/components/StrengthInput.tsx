import React, { useState } from 'react';

interface StrengthInputProps {
  onAnalyze: (text: string) => void;
}

export const StrengthInput: React.FC<StrengthInputProps> = ({ onAnalyze }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 print:hidden">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">输入优势识别结果</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请粘贴您的优势识别器结果文本..."
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          分析优势
        </button>
      </form>
    </div>
  );
};