
import React from 'react';

const ItemCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse border border-gray-700">
      <div className="w-full h-56 bg-gray-700"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-7 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardSkeleton;