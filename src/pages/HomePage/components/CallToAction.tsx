import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const CallToAction: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isArabic = language === "ar";
  const isDark = theme === "dark";

  return (
    <section
      className={`py-20 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-current">
          {isArabic
            ? "مستعد لبدء مغامرتك القادمة؟"
            : "Ready to start your next adventure?"}
        </h2>

        <p
          className={`mt-4 text-lg max-w-2xl mx-auto ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {isArabic
            ? "انضم إلى آلاف المستخدمين السعداء. ابحث، قارن، واحجز وجهتك المثالية اليوم."
            : "Join thousands of happy users. Search, compare, and book your perfect destination today."}
        </p>

        <h1
          className={`mt-12 font-bold text-5xl ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          mahjo<span className="text-orange-500">oz</span>
        </h1>
      </div>
    </section>
  );
};

export default CallToAction;
