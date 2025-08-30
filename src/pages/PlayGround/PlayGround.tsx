import { useState, useEffect, useCallback } from "react";
import ItemCard from "../../components/MinCard/ItemCard";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/Footer";
import { FaFutbol } from "react-icons/fa";
import type { PlayGround } from "../../types";
import { apiService } from "../../services/apiService";

// ✅ 1. استيراد السياقات
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const customAnimations = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up-item { animation: fade-in-up 0.6s ease-out forwards; }
`;

// ✅ 2. تعريف كائن الترجمات
const translations = {
  ar: {
    searchTitle: "ابحث عن ملعبك المثالي",
    searchPlaceholder: "ابحث عن اسم الملعب...",
    searchButton: "بحث",
    loadingPlaygrounds: "جاري تحميل الملاعب...",
    foundPlaygrounds: (options: { count: number }) => `وجدنا لك ${options.count} ملعباً`,
    noPlaygroundsTitle: "لا توجد ملاعب تطابق بحثك",
    noPlaygroundsMessage: "جرّب تغيير كلمات البحث.",
    failedToLoadPlaygrounds: "فشل تحميل الملاعب",
  },
  en: {
    searchTitle: "Find Your Perfect Playground",
    searchPlaceholder: "Search for playground name...",
    searchButton: "Search",
    loadingPlaygrounds: "Loading playgrounds...",
    foundPlaygrounds: (options: { count: number }) => `Found ${options.count} playgrounds for you`,
    noPlaygroundsTitle: "No playgrounds match your search",
    noPlaygroundsMessage: "Try changing your search terms.",
    failedToLoadPlaygrounds: "Failed to load playgrounds",
  },
};

const PlayGroundPage = () => {
  // استدعاء السياقات
  const { language } = useLanguage();
  const { theme } = useTheme();

  // تعريف دالة الترجمة
  const t = useCallback((key: keyof typeof translations['en'], options?: { count: number }) => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return (translation as (options: { count: number }) => string)(options!);
    }
    return translation;
  }, [language]);

  const [playgrounds, setPlaygrounds] = useState<PlayGround[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlaygrounds = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPlaygrounds(query);
      setPlaygrounds(data);

      const ratingsData = await apiService.getBatchRatings(
        data.map((pg) => ({ type: "playground", id: pg.id }))
      );

      const playgroundRatings: Record<number, number> = {};
      Object.entries(ratingsData).forEach(([key, rating]) => {
        const pgId = parseInt(key.split("_")[1]);
        playgroundRatings[pgId] = rating;
      });
      setRatings(playgroundRatings);

    } catch (err: any) {
      if (err.message.includes("404")) {
        setPlaygrounds([]);
      } else {
        console.error("❌ Error fetching playgrounds:", err);
        setError(err.message || t("failedToLoadPlaygrounds"));
        setPlaygrounds([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaygrounds();
  }, []);

  const handleSearch = () => {
    fetchPlaygrounds(searchQuery);
  };

  const filteredPlaygrounds = playgrounds.filter(
    (pg) =>
      pg.ar_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pg.en_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <style>{customAnimations}</style>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* البحث */}
        <div className={`backdrop-blur-sm p-8 rounded-2xl border mb-16 shadow-lg transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-3xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('searchTitle')}
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
                theme === 'dark' 
                ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500' 
                : 'bg-gray-100 text-gray-900 border-gray-300 focus:ring-orange-500'
              }`}
            />
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              {t('searchButton')}
            </button>
          </div>
        </div>

        {/* العنوان */}
        <div className="mb-8 text-center">
          <h3 className={`text-3xl font-bold transition-opacity duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {loading
              ? t("loadingPlaygrounds")
              : t("foundPlaygrounds", { count: filteredPlaygrounds.length })}
          </h3>
        </div>

        {/* عرض الملاعب */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : filteredPlaygrounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPlaygrounds.map((pg) => (
              <div key={pg.id} className="animate-fade-in-up-item">
                <ItemCard
                  item={pg}
                  loading={false}
                  type="playground"
                  rating={ratings[pg.id] || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up-item">
            <FaFutbol className={`text-7xl mx-auto mb-6 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{t('noPlaygroundsTitle')}</h2>
            <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{t('noPlaygroundsMessage')}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PlayGroundPage;