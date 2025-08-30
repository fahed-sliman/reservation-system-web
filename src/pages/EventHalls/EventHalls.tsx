import { useState, useEffect, useCallback } from "react";
import ItemCard from "../../components/MinCard/ItemCard";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/Footer";
import { FaMapSigns } from "react-icons/fa";
import type { EventHall } from "../../types";
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
    searchTitle: "ابحث عن القاعة المناسبة",
    searchPlaceholder: "ابحث عن اسم القاعة...",
    searchButton: "بحث",
    loadingHalls: "جاري تحميل القاعات...",
    foundHalls: (options: { count: number }) => `وجدنا لك ${options.count} قاعة`,
    noHallsTitle: "لا توجد قاعات تطابق بحثك",
    noHallsMessage: "جرّب تغيير كلمات البحث.",
    failedToLoadHalls: "فشل تحميل القاعات",
  },
  en: {
    searchTitle: "Find the Perfect Hall",
    searchPlaceholder: "Search for hall name...",
    searchButton: "Search",
    loadingHalls: "Loading halls...",
    foundHalls: (options: { count: number }) => `Found ${options.count} halls for you`,
    noHallsTitle: "No halls match your search",
    noHallsMessage: "Try changing your search terms.",
    failedToLoadHalls: "Failed to load halls",
  },
};

const EventHallsPage = () => {
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

  const [halls, setHalls] = useState<EventHall[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventHalls = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getEventHalls(query);
      setHalls(data);

      const ratingsData = await apiService.getBatchRatings(
        data.map(hall => ({ type: "event_hall", id: hall.id }))
      );

      const hallRatings: Record<number, number> = {};
      Object.entries(ratingsData).forEach(([key, rating]) => {
        const parts = key.split("_");
        const hallId = parseInt(parts[parts.length - 1]);
        hallRatings[hallId] = rating as number;
      });
      setRatings(hallRatings);

    } catch (err: any) {
      console.error("❌ API Error fetching halls:", err);
      setError(err.message || t("failedToLoadHalls"));
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventHalls();
  }, []);

  const filteredHalls = halls.filter(
    (hall) =>
      hall.ar_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hall.en_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    fetchEventHalls(searchQuery);
  };

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

        <div className="mb-8 text-center">
          <h3 className={`text-3xl font-bold transition-opacity duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {loading
              ? t("loadingHalls")
              : t("foundHalls", { count: filteredHalls.length })}
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : filteredHalls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHalls.map((hall) => (
              <div key={hall.id} className="animate-fade-in-up-item">
                <ItemCard
                  item={hall}
                  loading={false}
                  type="event_hall"
                  rating={ratings[hall.id] || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up-item">
            <FaMapSigns className={`text-7xl mx-auto mb-6 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
              {t('noHallsTitle')}
            </h2>
            <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{t('noHallsMessage')}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventHallsPage;