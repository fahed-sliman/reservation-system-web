import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// تأكد من أن مسارات الاستيراد صحيحة لمشروعك
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// كائن يحتوي على جميع النصوص لتسهيل الترجمة
const translations = {
  ar: {
    brandDescription: "منصتك الأولى لاكتشاف وحجز أفضل الفنادق، قاعات المناسبات، المطاعم، والمزيد. نحن نضمن لك تجربة سلسة وموثوقة.",
    quickLinksTitle: "روابط سريعة",
    links: {
      hotels: "الفنادق",
      eventhalls: "قاعات المناسبات",
      restaurants: "المطاعم",
      playgrounds: "الملاعب",
      tours: "الرحلات السياحية",
    },
    contactTitle: "تواصل معنا",
    address: "دمشق، سوريا",
    email: "contact@mahjoozTeam",
    developersTitle: "فريق التطوير",
    developers: ["فهد سليمان-فرومت اند", "محمد الغزالي-فرومت اند", "ايمن مملوك -باك اند", "ممحد الرفاعي -باك اند"],
    copyright: `© ${new Date().getFullYear()} mahjooz. جميع الحقوق محفوظة.`
  },
  en: {
    brandDescription: "Your premier platform to discover and book the best hotels, event halls, restaurants, and more. We guarantee a seamless and reliable experience.",
    quickLinksTitle: "Quick Links",
    links: {
      hotels: "Hotels",
      eventhalls: "Event Halls",
      restaurants: "Restaurants",
      playgrounds: "Playgrounds",
      tours: "Tours",
    },
    contactTitle: "Contact Us",
    address: "Damascus, Syria",
    email: "contact@mahjooz Team",
    developersTitle: "Development Team",
    developers: ["Fahed Sliman -  Front-end", "Mohammed Al-Ghazali  - Front-end", "Ayman Al-Mamlouk -  Back-end", "Mohammed Al-Rifai -  Backend"],
    copyright: `© ${new Date().getFullYear()} mahjooz. All rights reserved.`
  }
};

const Footer = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  // اختيار الترجمة المناسبة بناءً على اللغة الحالية
  const t = translations[language];

  // استخدام useMemo لتحديد أصناف CSS بناءً على الثيم لتحسين الأداء
  const themeClasses = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      footer: isDark ? 'bg-gray-900 text-gray-400 border-t border-gray-700/50' : 'bg-gray-50 text-gray-600 border-t border-gray-200',
      heading: isDark ? 'text-white' : 'text-gray-900',
      brand: isDark ? 'text-white' : 'text-gray-900',
      link: isDark ? 'hover:text-orange-400' : 'hover:text-orange-500',
      bottomBorder: isDark ? 'border-gray-700/50' : 'border-gray-200',
      copyright: isDark ? 'text-gray-500' : 'text-gray-400',
    };
  }, [theme]);

  return (
    <footer className={themeClasses.footer} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* --- القسم الأول: حول الموقع --- */}
          <div className="space-y-6">
            <Link to="/" className={`text-2xl font-bold ${themeClasses.brand}`}>
              mahjo<span className="text-orange-500">oz</span>
            </Link>
            <p className="text-sm leading-relaxed">
              {t.brandDescription}
            </p>
          </div>

          {/* --- القسم الثاني: روابط سريعة --- */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${themeClasses.heading} tracking-wider`}>{t.quickLinksTitle}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/hotels" className={`${themeClasses.link} transition-colors`}>{t.links.hotels}</Link></li>
              <li><Link to="/eventhalls" className={`${themeClasses.link} transition-colors`}>{t.links.eventhalls}</Link></li>
              <li><Link to="/restaurants" className={`${themeClasses.link} transition-colors`}>{t.links.restaurants}</Link></li>
              <li><Link to="/playgrounds" className={`${themeClasses.link} transition-colors`}>{t.links.playgrounds}</Link></li>
              <li><Link to="/tours" className={`${themeClasses.link} transition-colors`}>{t.links.tours}</Link></li>
            </ul>
          </div>

          {/* --- القسم الثالث: تواصل معنا --- */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${themeClasses.heading} tracking-wider`}>{t.contactTitle}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-400 mt-1 flex-shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-orange-400" />
                <a href="mailto:slymanmr693@gmail.com" className={`${themeClasses.link} transition-colors`}>{t.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-orange-400" />
                <a href="tel:+96395396264" className={`${themeClasses.link} transition-colors`} dir="ltr">+963 959 396 264</a>
              </li>
            </ul>
          </div>
          
          {/* --- القسم الرابع: مطورو الموقع --- */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${themeClasses.heading} tracking-wider`}>{t.developersTitle}</h3>
            <ul className="space-y-3 text-sm">
              {t.developers.map((dev, index) => (
                <li key={index}>
                  <span className="transition-colors cursor-pointer">{dev}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className={`mt-12 pt-8 border-t ${themeClasses.bottomBorder} text-center`}>
          <p className={`text-xs ${themeClasses.copyright}`}>
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;