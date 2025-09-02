import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// ✅ الخطوة 1: استيراد useTheme hook

const LoadingSpinner: React.FC = () => {
  // ✅ الخطوة 2: استدعاء hook للحصول على المظهر الحالي
  const { theme } = useTheme();

  return (
    // ✅ الخطوة 3: تطبيق الأنماط الديناميكية على الحاوية الرئيسية
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-[#1a1f27]'
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Enhanced Spinner */}
        <div className="relative">
          {/* الدائرة الأساسية تتغير مع المظهر */}
          <div className={`w-16 h-16 border-4 border-t-orange-500 rounded-full animate-spin ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          }`}></div>
          {/* الدائرة الثانوية تبقى برتقالية */}
          <div 
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-300 rounded-full animate-spin" 
            style={{ 
              animationDirection: 'reverse', 
              animationDuration: '1.2s' // تعديل بسيط للتباين في السرعة
            }}
          ></div>
        </div>
                
        {/* Brand */}
        <div className="text-center">
          {/* لون النص يتغير مع المظهر */}
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Mahjo<span className="text-orange-500">oz</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;