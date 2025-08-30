import React from "react";
import { useTheme } from "../../context/ThemeContext";

const HeroSliderSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative h-screen overflow-hidden ${
        isDark ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      {/* Background Skeleton */}
      <div
        className={`absolute inset-0 animate-pulse ${
          isDark ? "bg-gray-800" : "bg-gray-300"
        }`}
      ></div>

      {/* Content Skeleton */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-8">
        {/* Main Title Skeleton */}
        <div
          className={`h-20 md:h-32 rounded-lg w-96 md:w-[600px] animate-pulse ${
            isDark ? "bg-gray-700" : "bg-gray-400"
          }`}
        ></div>

        {/* Description Skeleton */}
        <div className="space-y-3 max-w-4xl w-full">
          <div
            className={`h-6 rounded w-full animate-pulse ${
              isDark ? "bg-gray-700" : "bg-gray-400"
            }`}
          ></div>
          <div
            className={`h-6 rounded w-5/6 mx-auto animate-pulse ${
              isDark ? "bg-gray-700" : "bg-gray-400"
            }`}
          ></div>
          <div
            className={`h-6 rounded w-4/6 mx-auto animate-pulse ${
              isDark ? "bg-gray-700" : "bg-gray-400"
            }`}
          ></div>
        </div>

        {/* Button Skeleton */}
        <div
          className={`h-14 rounded-full w-64 animate-pulse ${
            isDark ? "bg-gray-700" : "bg-gray-400"
          }`}
        ></div>
      </div>

      {/* Dots Skeleton */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full animate-pulse ${
              isDark ? "bg-gray-600" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSliderSkeleton;
