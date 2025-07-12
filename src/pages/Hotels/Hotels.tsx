

import  { useState, useEffect } from "react";
import ItemCard from "../../components/MinCard/ItemCard";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/header";
import { FaStar, FaMapMarkerAlt, FaHotel } from "react-icons/fa";    

import { mockHotels, mockRatings, mockCategories } from "../../data/mockdata";
import type { Hotel } from "../../types";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";

// *** إضافة: أنماط CSS للتأثيرات الحركية ***
const customAnimations = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up-item {
    animation: fade-in-up 0.6s ease-out forwards;
  }
`;

const HotelsPage = () => {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockHotels.filter((hotel) => {
        const ratingData = mockRatings.filter(r => r.rateable_type === 'hotel' && r.rateable_id === hotel.id);
        const avgRating = ratingData.length > 0 
          ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
          : 0;

        const matchesRating = avgRating >= minRating;
        const matchesLocation = !searchQuery || hotel.en_location.toLowerCase().includes(searchQuery.toLowerCase().trim());

        return matchesRating && matchesLocation;
      });
      setFilteredHotels(filtered);
      setLoading(false);
    }, 800); 
    return () => clearTimeout(timer);
  }, [minRating, searchQuery]);

  const handleResetFilters = () => {
    setMinRating(0);
    setSearchQuery("");
  };

  const hotelCategory = mockCategories.find(cat => cat.en_title.toLowerCase().includes('hotel'));

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <style>{customAnimations}</style>

      <div className="relative h-[60vh] w-full">
        <img src={hotelCategory?.image || '/public/hotels.jpg'} alt="Explore Hotels" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl animate-fade-in-down">
            {hotelCategory?.en_title || 'Explore Hotels'}
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-gray-200 max-w-3xl animate-fade-in-up leading-relaxed">
            ابحث وقارن بين مئات الفنادق للعثور على المكان المثالي لإقامتك القادمة.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* --- شريط الفلترة الجمالي الجديد --- */}
        <div className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-16 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-white mb-6">ابحث عن إقامتك المثالية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
                {/* فلتر التقييم */}
                <div className="w-full lg:col-span-1">
                    <label className="block text-orange-400 font-bold mb-2">التقييم</label>
                    <div className="relative">
                        <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                        >
                            {[0, 1, 2, 3, 4].map((rate) => (
                                <option key={rate} value={rate}>{rate === 0 ? "كل التقييمات" : `${rate}+ نجوم`}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* فلتر الموقع (نص) */}
                <div className="w-full md:col-span-2 lg:col-span-2">
                    <label className="block text-orange-400 font-bold mb-2">الموقع</label>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن مدينة أو منطقة..."
                            className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                {/* زر إلغاء الفلاتر */}
                <div className="w-full">
                    <button onClick={handleResetFilters} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">
                        إعادة تعيين
                    </button>
                </div>
            </div>
        </div>

        {/* --- قسم عرض النتائج --- */}
        <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-white transition-opacity duration-500">
                {loading ? 'جاري البحث عن أفضل الفنادق...' : `وجدنا لك ${filteredHotels.length} فندقاً`}
            </h3>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
            </div>
        ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredHotels.map((hotel) => {
                    const ratingInfo = mockRatings.find(r => r.rateable_type === 'hotel' && r.rateable_id === hotel.id);
                    return (
                        <div key={hotel.id} className="animate-fade-in-up-item">
                            <ItemCard item={hotel} loading={false} type="hotel" rating={ratingInfo || null} />
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-20 animate-fade-in-up-item">
                <FaHotel className="text-7xl text-gray-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-400">لا توجد فنادق تطابق بحثك</h2>
                <p className="text-lg text-gray-500 mt-2">جرّب تغيير كلمات البحث أو تعديل الفلاتر.</p>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HotelsPage;