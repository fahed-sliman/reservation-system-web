// src/components/RoomCardSkeleton.tsx
import React from 'react';

const RoomCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 animate-pulse flex flex-col sm:flex-row items-center gap-5">
    <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0"></div>
    <div className="flex-grow w-full space-y-3">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
    <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
      <div className="h-12 bg-gray-700 rounded-lg w-full sm:w-32"></div>
    </div>
  </div>
);

export default RoomCardSkeleton;