// src/components/ItemDetailsCardSkeleton.tsx

import React from 'react';

const ItemDetailsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/60 rounded-2xl shadow-xl border border-gray-700 overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Image Skeleton */}
        <div className="md:col-span-2 h-64 md:h-full bg-gray-700"></div>

        {/* Details Skeleton */}
        <div className="md:col-span-3 p-8 space-y-6">
          <div>
            <div className="h-10 bg-gray-700 rounded-lg w-3/4 mb-3"></div>
            <div className="h-6 bg-gray-700 rounded-lg w-1/2"></div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-700">
            <div className="h-6 bg-gray-700 rounded w-full"></div>
            <div className="h-6 bg-gray-700 rounded w-full"></div>
            <div className="h-6 bg-gray-700 rounded w-5/6"></div>
            <div className="h-6 bg-gray-700 rounded w-4/6"></div>
          </div>

          <div className="h-8 bg-gray-700 rounded-lg w-1/3 mt-4"></div>

          <div className="space-y-2 pt-6 border-t border-gray-700">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>

          <div className="pt-8">
            <div className="h-14 bg-orange-800/50 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsCardSkeleton;