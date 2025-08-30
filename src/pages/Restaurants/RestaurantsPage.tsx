import React, { useState, useEffect, useCallback } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/header";
import ItemCard from "../../components/MinCard/ItemCard";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";
import { FaUtensils } from "react-icons/fa";
import type { Restaurant } from "../../types";
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
    searchTitle: "ابحث عن مطعمك المفضل",
    searchPlaceholder: "اكتب اسم المطعم عربي أو إنجليزي...",
    searchButton: "بحث",
    loadingRestaurants: "جاري تحميل المطاعم...",
    foundRestaurants: (options: { count: number }) => `وجدنا لك ${options.count} مطعماً`,
    noRestaurantsTitle: "لا توجد مطاعم تطابق بحثك",
    noRestaurantsMessage: "جرّب تغيير كلمات البحث.",
    failedToLoadRestaurants: "فشل تحميل المطاعم",
  },
  en: {
    searchTitle: "Find Your Favorite Restaurant",
    searchPlaceholder: "Type restaurant name in Arabic or English...",
    searchButton: "Search",
    loadingRestaurants: "Loading restaurants...",
    foundRestaurants: (options: { count: number }) => `Found ${options.count} restaurants for you`,
    noRestaurantsTitle: "No restaurants match your search",
    noRestaurantsMessage: "Try changing your search terms.",
    failedToLoadRestaurants: "Failed to load restaurants",
  },
};

const RestaurantsPage: React.FC = () => {
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

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRestaurants = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getRestaurants(query);
      setRestaurants(data);

      const ratingsData = await apiService.getBatchRatings(
        data.map(r => ({ type: 'restaurant', id: r.id }))
      );

      const restaurantRatings: Record<number, number> = {};
      Object.entries(ratingsData).forEach(([key, rating]) => {
        const rId = parseInt(key.split('_')[1]);
        restaurantRatings[rId] = rating;
      });
      setRatings(restaurantRatings);

    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError(err.message || t("failedToLoadRestaurants"));
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = () => {
    fetchRestaurants(searchQuery);
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.ar_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.en_title.toLowerCase().includes(searchQuery.toLowerCase())
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
              ? t("loadingRestaurants")
              : t("foundRestaurants", { count: filteredRestaurants.length })}
          </h3>
        </div>

        {/* عرض المطاعم */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="animate-fade-in-up-item">
                <ItemCard
                  item={restaurant}
                  loading={false}
                  type="restaurant"
                  rating={ratings[restaurant.id] || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up-item">
            <FaUtensils className={`text-7xl mx-auto mb-6 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{t('noRestaurantsTitle')}</h2>
            <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{t('noRestaurantsMessage')}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantsPage;