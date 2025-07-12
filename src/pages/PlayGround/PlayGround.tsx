

import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/header";
import ItemCard from "../../components/MinCard/ItemCard";
import { FaStar, FaMapMarkerAlt, FaDollarSign, FaUsers, FaFutbol } from "react-icons/fa";

import { mockPlaygrounds, mockRatings, mockCategories } from "../../data/mockdata";
import type { PlayGround, RatingInfo } from "../../types";
import ItemCardSkeleton from "../../components/MinCard/ItemCardSkeleton";

// --- أنماط CSS للتأثيرات الحركية ---
const customAnimations = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up-item {
    animation: fade-in-up 0.6s ease-out forwards;
  }
`;

const PlaygroundsPage: React.FC = () => {
  const [filteredGrounds, setFilteredGrounds] = useState<PlayGround[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(""); // تغيير إلى أقصى سعر لمرونة أكبر
  const [minCapacity, setMinCapacity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const priceNum = Number(maxPrice);
      const capacityNum = Number(minCapacity);

      const filtered = mockPlaygrounds.filter((ground) => {
        const ratingData = mockRatings.filter(
          (r) => r.rateable_id === ground.id && r.rateable_type === "playground"
        );
        const avgRating =
          ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 0;

        const matchesRating = avgRating >= minRating;
        const matchesLocation = !searchLocation || ground.en_location.toLowerCase().includes(searchLocation.toLowerCase().trim());
        const matchesPrice = maxPrice === "" || ground.price <= priceNum;
        const matchesCapacity = minCapacity === "" || ground.capacity >= capacityNum;

        return matchesRating && matchesLocation && matchesPrice && matchesCapacity;
      });

      setFilteredGrounds(filtered);
      setLoading(false);
    }, 800); // محاكاة تحميل

    return () => clearTimeout(timer);
  }, [minRating, searchLocation, maxPrice, minCapacity]);

  const handleResetFilters = () => {
    setMinRating(0);
    setSearchLocation("");
    setMaxPrice("");
    setMinCapacity("");
  };

  const playgroundCategory = mockCategories.find(cat => cat.en_title.toLowerCase().includes('playground'));

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <style>{customAnimations}</style>

      {/* --- قسم Hero الديناميكي والجمالي --- */}
      <div className="relative h-[60vh] w-full">
        <img
          src={playgroundCategory?.image || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1350&q=80"}
          alt="Playgrounds"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl animate-fade-in-down">
            {playgroundCategory?.en_title || 'Sports Playgrounds'}
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-gray-200 max-w-3xl animate-fade-in-up leading-relaxed">
            ابحث عن الملعب المثالي لممارسة رياضتك المفضلة واحجزه بسهولة.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* --- شريط الفلترة الاحترافي --- */}
        <div className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-6">ابحث عن ملعبك المفضل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            
            <div className="lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">التقييم</label>
              <div className="relative">
                <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none">
                  {[0, 1, 2, 3, 4].map((rate) => <option key={rate} value={rate}>{rate === 0 ? "الكل" : `${rate}+ نجوم`}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">الموقع</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="المدينة..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">السعر (الأقصى)</label>
              <div className="relative">
                <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" placeholder="e.g., 150" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">السعة (الأدنى)</label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" placeholder="e.g., 10" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>

            <button onClick={handleResetFilters} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">إعادة تعيين</button>
          </div>
        </div>

        {/* --- قسم عرض النتائج --- */}
        <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-white transition-opacity duration-500">
                {loading ? 'جاري البحث عن أفضل الملاعب...' : `وجدنا لك ${filteredGrounds.length} ملعباً`}
            </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
          </div>
        ) : filteredGrounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGrounds.map((ground) => {
              const ratingInfo = mockRatings.find(r => r.rateable_type === 'playground' && r.rateable_id === ground.id);
              return (
                <div key={ground.id} className="animate-fade-in-up-item">
                  <ItemCard item={ground} loading={false} type="playground" rating={ratingInfo || null} />
                </div>
              );
            })}
          </div>
        ) : (
            <div className="text-center py-20 animate-fade-in-up-item">
                <FaFutbol className="text-7xl text-gray-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-400">لا توجد ملاعب تطابق بحثك</h2>
                <p className="text-lg text-gray-500 mt-2">جرّب تغيير كلمات البحث أو تعديل الفلاتر.</p>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PlaygroundsPage;