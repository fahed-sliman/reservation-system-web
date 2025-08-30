import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/Footer';
import ItemDetailsCard from '../../components/MaxCard/itemDetailsCard';
import { apiService } from '../../services/apiService';
import type { RateableType, TourStop } from '../../types';
import CommentsSection from '../../components/Comment/CommentSection';

// ✅ 1. استيراد السياقات
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// ✅ 2. تعريف الترجمات
const translations = {
  ar: {
    tourStopsTitle: "محطات الجولة",
    notFoundTitle: "404",
    notFoundMessage: "العنصر غير موجود",
  },
  en: {
    tourStopsTitle: "Tour Stops",
    notFoundTitle: "404",
    notFoundMessage: "Item Not Found",
  },
};

const TourStopsSection: React.FC<{ stops: TourStop[] }> = ({ stops }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  
  const [openStopId, setOpenStopId] = useState<number | null>(stops.length > 0 ? stops[0].id : null);
  const toggleStop = (id: number) => setOpenStopId(openStopId === id ? null : id);

  return (
    <section className={`mt-12 p-6 md:p-8 rounded-2xl border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <h3 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('tourStopsTitle')}</h3>
      <div className="space-y-4">
        {stops.map((stop) => (
          <div key={stop.id} className={`rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => toggleStop(stop.id)}
              className={`w-full flex justify-between items-center p-5 transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold text-lg">{stop.sequence}</span>
                <span className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{language === 'ar' ? stop.ar_title : stop.en_title}</span>
              </div>
              <svg className={`w-6 h-6 transition-transform ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${openStopId === stop.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${openStopId === stop.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className={`p-5 border-t space-y-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                {stop.image && <img src={stop.image} alt={language === 'ar' ? stop.ar_title : stop.en_title} className="w-full h-56 object-cover rounded-lg mb-4" />}
                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'ar' ? stop.ar_description : stop.en_description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const GenericDetailsPage: React.FC = () => {
  const { type, id } = useParams<{ type: RateableType; id: string }>();
  const itemId = Number(id);
  const navigate = useNavigate();

  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

  const [item, setItem] = useState<any | null>(null);
  const [tourStops, setTourStops] = useState<TourStop[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedItem = await apiService.getItem(type as RateableType, itemId);
        const cleanData = {
          ...fetchedItem,
          image: fetchedItem.image?.trim() ?? "/default-image.png",
          price: fetchedItem.price ? parseFloat(fetchedItem.price) : null,
        };
        setItem(cleanData);

        const avgRating = await apiService.getAverageRating(type as RateableType, itemId);
        setAverageRating(avgRating);

        if (type === 'tour') {
          const stops = await apiService.getTourStops(itemId);
          setTourStops(stops.sort((a, b) => a.sequence - b.sequence));
        }

      } catch (err) {
        console.error("Failed to fetch item or stops:", err);
        setItem(null); // Ensure item is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, itemId]);

  const handleHotelBooking = () => {
    if (item && type === 'hotel') navigate(`/hotel-rooms/${item.id}`);
  };

  if (!loading && !item) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-red-500">{t('notFoundTitle')}</h1>
          <p className="text-2xl mt-4">{t('notFoundMessage')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <ItemDetailsCard
          loading={loading}
          item={item ?? undefined}
          type={type as RateableType}
          averageRating={averageRating}
          onBookHotelClick={handleHotelBooking}
        />

        {type === 'tour' && !loading && tourStops.length > 0 && (
          <TourStopsSection stops={tourStops} />
        )}

        {!loading && item && (
          <CommentsSection
            type={type as RateableType}
            itemId={item.id}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GenericDetailsPage;