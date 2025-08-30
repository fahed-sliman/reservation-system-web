import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ItemCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl shadow-md transition-all duration-300 ease-in-out border flex flex-col h-full animate-pulse ${
        isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white border-gray-200"
      }`}
    >
      {/* الصورة */}
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className={`w-full h-60 ${isDark ? "bg-gray-700" : "bg-gray-300"}`}></div>
        
        {/* هيكل للنصوص فوق الصورة */}
        <div className="absolute bottom-4 left-4 w-3/4 space-y-2">
          <div className={`h-7 rounded-md ${isDark ? "bg-gray-600" : "bg-gray-400"}`}></div>
          <div className={`h-4 w-1/4 rounded-md ${isDark ? "bg-gray-600" : "bg-gray-400"}`}></div>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="p-5 flex flex-col flex-grow">
        {/* هيكل لتقييم النجوم */}
        <div className={`h-6 w-28 rounded-md mb-4 ${isDark ? "bg-gray-700" : "bg-gray-300"}`}></div>
        
        {/* فاصل مرن لدفع الأزرار للأسفل */}
        <div className="flex-grow"></div>

        {/* هيكل للأزرار */}
        <div className="mt-4 w-full flex flex-col sm:flex-row gap-3">
          <div className={`h-12 w-full rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-300"}`}></div>
          {/* يمكنك إضافة زر ثانٍ هنا إذا أردت محاكاة بطاقة الفندق دائمًا */}
          {/* <div className={`h-12 w-full rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-300"}`}></div> */}
        </div>
      </div>
    </div>
  );
};

export default ItemCardSkeleton;