import React from 'react';

// استيراد سياق المظهر
import { useTheme } from '../../context/ThemeContext';

const RoomCardSkeleton: React.FC = () => {
    const { theme } = useTheme();

    return (
      <div 
        className={`rounded-xl border overflow-hidden flex flex-col md:flex-row shadow-lg transition-all duration-300 animate-pulse ${
            theme === 'dark'
            ? 'bg-gray-800/60 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        
        {/* Skeleton للصورة */}
        <div className="w-full md:w-2/5 h-60 md:h-auto flex-shrink-0">
          <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>

        {/* Skeleton للمحتوى */}
        <div className="flex-grow flex flex-col p-6 w-full">
          {/* Skeleton للتفاصيل الرئيسية */}
          <div className="flex-grow">
            {/* Title */}
            <div className={`h-7 rounded w-3/5 mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            {/* Description */}
            <div className={`h-4 rounded w-full mb-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 rounded w-5/6 mb-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            
            {/* Features Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-4 rounded w-16 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton للسعر والحجز */}
          <div className={`mt-auto pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`h-8 w-24 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-12 w-full sm:w-32 rounded-lg ${theme === 'dark' ? 'bg-orange-800/50' : 'bg-orange-200'}`}></div>
          </div>
        </div>
      </div>
    );
};

export default RoomCardSkeleton;