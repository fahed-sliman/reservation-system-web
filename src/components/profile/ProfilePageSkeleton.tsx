
import React from 'react';

const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#1a1f27] text-white flex justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-pulse">
          
          <div className="md:col-span-1 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center">
              {/* صورة البروفايل */}
              <div className="w-40 h-40 rounded-full bg-gray-700"></div>
              
              {/* زر "تغيير الصورة" */}
              <div className="h-5 w-40 bg-gray-700 rounded-md mt-4"></div>

              <div className="mt-6 w-full space-y-2">
                <div className="h-9 w-3/4 mx-auto bg-gray-700 rounded-md"></div>
              </div>
            </div>

            <div className="mt-8 md:mt-auto w-full space-y-4">
              <div className="h-12 w-full bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          <div className="md:col-span-2">
            {/* عنوان "تفاصيل المستخدم" */}
            <div className="h-8 w-48 bg-gray-700 rounded-md mb-8"></div>
            
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-1/4 bg-gray-700 rounded-md"></div>
                  <div className="h-12 w-full bg-gray-800 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}; 

export default ProfilePageSkeleton;