import React from 'react';

// ✅ الخطوة 1: استيراد useTheme hook
import { useTheme } from '../../context/ThemeContext'; // تأكد من صحة المسار

const ItemDetailsCardSkeleton: React.FC = () => {
  // ✅ الخطوة 2: استدعاء hook للحصول على المظهر الحالي
  const { theme } = useTheme();

  return (
    // ✅ الخطوة 3: تطبيق الأنماط الديناميكية على كل العناصر
    <div className={`rounded-2xl shadow-xl border overflow-hidden animate-pulse transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/60 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Image Skeleton */}
        <div className={`md:col-span-2 h-64 md:h-full ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>

        {/* Details Skeleton */}
        <div className="md:col-span-3 p-8 space-y-6">
          {/* Title & Subtitle Skeleton */}
          <div>
            <div className={`h-10 rounded-lg w-3/4 mb-3 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`h-6 rounded-lg w-1/2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>

          {/* Features Skeleton */}
          <div className={`grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`h-6 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-6 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-6 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-6 rounded w-4/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>

          {/* Price Skeleton */}
          <div className={`h-8 rounded-lg w-1/3 mt-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}></div>

          {/* Description Skeleton */}
          <div className={`space-y-2 pt-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>

          {/* Button Skeleton */}
          <div className="pt-8">
            <div className={`h-14 rounded-full w-full ${
              theme === 'dark' ? 'bg-orange-800/50' : 'bg-orange-200'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsCardSkeleton;