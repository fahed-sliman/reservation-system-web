
import { useState, useEffect, useCallback } from "react";
import ItemCard from "../../components/MinCard/ItemCard";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";
import { FaHotel } from "react-icons/fa";
import type { Hotel } from "../../types";
import { apiService } from "../../services/apiService";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Layout from "../../layout/Layout";

const customAnimations = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up-item { animation: fade-in-up 0.6s ease-out forwards; }
`;

const translations = {
  ar: {
    searchTitle: "ابحث عن إقامتك المثالية",
    searchPlaceholder: "ابحث عن اسم الفندق...",
    searchButton: "بحث",
    loadingHotels: "جاري تحميل الفنادق...",
    foundHotels: (options: { count: number }) => `وجدنا لك ${options.count} فندقاً`,
    noHotelsTitle: "لا توجد فنادق تطابق بحثك",
    noHotelsMessage: "جرّب تغيير كلمات البحث.",
    failedToLoadHotels: "فشل تحميل الفنادق",
  },
  en: {
    searchTitle: "Find Your Perfect Stay",
    searchPlaceholder: "Search for hotel name...",
    searchButton: "Search",
    loadingHotels: "Loading hotels...",
    foundHotels: (options: { count: number }) => `Found ${options.count} hotels for you`,
    noHotelsTitle: "No hotels match your search",
    noHotelsMessage: "Try changing your search terms.",
    failedToLoadHotels: "Failed to load hotels",
  },
};

const HotelsPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const t = useCallback((key: keyof typeof translations['en'], options?: { count: number }) => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return (translation as (options: { count: number }) => string)(options!);
    }
    return translation;
  }, [language]);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHotels = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getHotels(query);
      setHotels(data);

      const ratingsData = await apiService.getBatchRatings(
        data.map((hotel) => ({ type: "hotel", id: hotel.id }))
      );

      const hotelRatings: Record<number, number> = {};
      Object.entries(ratingsData).forEach(([key, rating]) => {
        const hotelId = parseInt(key.split("_")[1]);
        hotelRatings[hotelId] = rating;
      });
      setRatings(hotelRatings);

    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || t('failedToLoadHotels'));
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = () => {
    fetchHotels(searchQuery);
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.ar_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.en_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout searchTerm={searchQuery} onSearchChange={e => setSearchQuery(e.target.value)} onSearchSubmit={handleSearch}>
      <style>{customAnimations}</style>

      {/* ✅ التعديل الأول: تغيير ألوان الخلفية والنص الرئيسية لتطابق صفحة المطاعم */}
      <div className={`min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* ✅ التعديل الثاني: تغيير خلفية صندوق البحث لتكون بيضاء في الوضع الفاتح */}
          <div className={`backdrop-blur-sm p-8 rounded-2xl border mb-16 shadow-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-3xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('searchTitle')}
            </h2>
            <div className="flex gap-4">
              {/* ✅ التعديل الثالث: تغيير خلفية حقل الإدخال لتكون أفتح في الوضع الفاتح */}
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-4 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
                  isDark 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-orange-500' 
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
            <h3 className={`text-3xl font-bold transition-opacity duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {loading
                ? t("loadingHotels")
                : t("foundHotels", { count: filteredHotels.length })}
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array(6).fill(0).map((_, idx) => (
                  <ItemCardSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className="animate-fade-in-up-item">
                  <ItemCard
                    item={hotel}
                    loading={false}
                    type="hotel"
                    rating={ratings[hotel.id] || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in-up-item">
              <FaHotel className={`text-7xl mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h2 className={`text-3xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>{t('noHotelsTitle')}</h2>
              <p className={`text-lg mt-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{t('noHotelsMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HotelsPage;