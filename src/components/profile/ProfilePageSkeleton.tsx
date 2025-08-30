import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ProfilePageSkeleton: React.FC = () => {
  const { theme } = useTheme();

  const bgMain =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 to-[#1a1f27] text-white"
      : "bg-gray-100 text-gray-900";

  const cardBg =
    theme === "dark"
      ? "bg-gray-800/50 border border-gray-700"
      : "bg-white border border-gray-200";

  const skeleton =
    theme === "dark" ? "bg-gray-700" : "bg-gray-300";
  const skeletonInput =
    theme === "dark" ? "bg-gray-800" : "bg-gray-200";

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-4 sm:p-8 ${bgMain}`}
    >
      <div
        className={`w-full max-w-5xl ${cardBg} backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-pulse">
          {/* العمود الأول */}
          <div className="md:col-span-1 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center">
              {/* صورة البروفايل */}
              <div className={`w-40 h-40 rounded-full ${skeleton}`}></div>

              {/* زر "تغيير الصورة" */}
              <div className={`h-5 w-40 rounded-md mt-4 ${skeleton}`}></div>

              <div className="mt-6 w-full space-y-2">
                <div
                  className={`h-9 w-3/4 mx-auto rounded-md ${skeleton}`}
                ></div>
              </div>
            </div>

            <div className="mt-8 md:mt-auto w-full space-y-4">
              <div className={`h-12 w-full rounded-lg ${skeleton}`}></div>
            </div>
          </div>

          {/* العمود الثاني */}
          <div className="md:col-span-2">
            {/* عنوان "تفاصيل المستخدم" */}
            <div className={`h-8 w-48 rounded-md mb-8 ${skeleton}`}></div>

            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className={`h-4 w-1/4 rounded-md ${skeleton}`}
                  ></div>
                  <div
                    className={`h-12 w-full rounded-md ${skeletonInput}`}
                  ></div>
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
