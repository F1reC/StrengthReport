import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onOCRComplete: (text: string) => void;
  onProcessing: (processing: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onOCRComplete, onProcessing }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const preprocessImage = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建 canvas context');

    // 设置合适的分辨率
    const scale = Math.min(2000 / img.width, 2000 / img.height, 2);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // 绘制白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 使用高质量的图像缩放
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 获取图像数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 增强对比度和锐化
    for (let i = 0; i < data.length; i += 4) {
      // 转换为灰度
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // 增强对比度
      const contrast = 1.5; // 对比度系数
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      const newValue = factor * (avg - 128) + 128;
      
      // 二值化处理
      const threshold = 180;
      const finalValue = newValue > threshold ? 255 : 0;
      
      data[i] = data[i + 1] = data[i + 2] = finalValue;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const processImage = async (file: File) => {
    try {
      onProcessing(true);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const processedImageUrl = preprocessImage(img);
      console.log('开始OCR识别');

      const worker = await createWorker('chi_sim', 1, {
        logger: progress => {
          if (progress.status === 'recognizing text') {
            setProgress(`识别中... ${Math.round(progress.progress * 100)}%`);
          }
        },
        errorHandler: error => {
          console.error('Tesseract错误:', error);
        }
      });

      const { data: { text } } = await worker.recognize(processedImageUrl);
      await worker.terminate();

      console.log('OCR识别完成');
      onOCRComplete(text.trim());
    } catch (error) {
      console.error('OCR处理错误:', error);
      setProgress('识别失败，请重试');
    } finally {
      setProgress('');
      onProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {imageUrl ? (
        <div className="space-y-4">
          <img src={imageUrl} alt="上传的图片" className="max-w-full h-auto mx-auto" />
          <p className="text-sm text-gray-500">
            {progress || "正在处理中..."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-500 hover:text-blue-600">点击上传</span>
              <span className="text-gray-500"> 或拖拽图片到这里</span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">支持 PNG, JPG 格式</p>
        </div>
      )}
    </div>
  );
}; 