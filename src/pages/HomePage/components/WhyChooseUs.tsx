import React from "react";
import { FaCalendarCheck, FaHeadset, FaShieldAlt, FaStar } from "react-icons/fa";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const WhyChooseUs: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isArabic = language === "ar";
  const isDark = theme === "dark";

  const features = [
    {
      icon: <FaShieldAlt size={32} />,
      title: isArabic ? "تقييمات موثوقة" : "Trusted Reviews",
      description: isArabic
        ? "نعتمد على تقييمات حقيقية من مستخدمين مثلك لتضمن الشفافية والمصداقية."
        : "We rely on real user reviews so you can trust the ratings.",
    },
    {
      icon: <FaStar size={32} />,
      title: isArabic ? "جودة لا تضاهى" : "Unmatched Quality",
      description: isArabic
        ? "نختار لك فقط أفضل الوجهات والأماكن التي تلبي أعلى معايير الجودة والتميز."
        : "We select only top destinations that meet high quality standards.",
    },
    {
      icon: <FaCalendarCheck size={32} />,
      title: isArabic ? "حجز فوري وسهل" : "Instant & Easy Booking",
      description: isArabic
        ? "نظام حجز بسيط وآمن يتيح لك تأكيد حجوزاتك في دقائق معدودة وبدون أي تعقيدات."
        : "A simple secure booking flow to confirm reservations in minutes.",
    },
    {
      icon: <FaHeadset size={32} />,
      title: isArabic ? "دعم فني 24/7" : "24/7 Support",
      description: isArabic
        ? "فريق دعم متخصص جاهز لمساعدتك في أي وقت والإجابة على جميع استفساراتك."
        : "Dedicated support team ready to help at any time.",
    },
  ];

  return (
    <section
      className={`py-24 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-current tracking-tight">
            {isArabic ? "لماذا تختار منصتنا؟" : "Why Choose Us?"}
          </h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-4 text-lg max-w-3xl mx-auto`}>
            {isArabic
              ? "نحن لا نقدم لك مجرد خدمة، بل نمنحك تجربة متكاملة وموثوقة من البداية إلى النهاية."
              : "We don’t just offer a service — we deliver a full, trusted experience from start to finish."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${isDark ? "bg-gray-900" : "bg-white"} p-8 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2`}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500/20 text-orange-400 mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-current mb-3">{feature.title}</h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-500"} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
