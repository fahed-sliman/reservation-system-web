import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/header";
import ItemCard from "../../components/MinCard/ItemCard";
import { FaStar, FaMapMarkerAlt, FaDollarSign, FaUsers, FaCalendarCheck } from "react-icons/fa";

// --- *** تغيير: استيراد البيانات من المصدر الموحد mockdata.ts *** ---
import { mockEventHalls, mockRatings, mockCategories } from "../../data/mockdata";
import type { EventHall, RatingInfo } from "../../types";
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

const EventHallsPage: React.FC = () => {
  const [filteredHalls, setFilteredHalls] = useState<EventHall[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [loading, setLoading] = useState(true);

  // --- منطق الفلترة باستخدام البيانات المركزية ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const priceNum = Number(maxPrice);
      const capacityNum = Number(minCapacity);

      const filtered = mockEventHalls.filter((hall) => {
        const ratingData = mockRatings.filter(
          (r) => r.rateable_id === hall.id && r.rateable_type === "event_hall"
        );
        const avgRating =
          ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 0;

        const matchesRating = avgRating >= minRating;
        const matchesLocation = !searchLocation || hall.en_location.toLowerCase().includes(searchLocation.toLowerCase().trim());
        const matchesPrice = maxPrice === "" || hall.price <= priceNum;
        const matchesCapacity = minCapacity === "" || hall.capacity >= capacityNum;

        return matchesRating && matchesLocation && matchesPrice && matchesCapacity;
      });

      setFilteredHalls(filtered);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [minRating, searchLocation, maxPrice, minCapacity]);

  const handleResetFilters = () => {
    setMinRating(0);
    setSearchLocation("");
    setMaxPrice("");
    setMinCapacity("");
  };

  const eventHallCategory = mockCategories.find(cat => cat.en_title.toLowerCase().includes('event hall'));

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <style>{customAnimations}</style>

      <div className="relative h-[60vh] w-full">
        <img
          src={eventHallCategory?.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1350&q=80"}
          alt="Event Halls"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl animate-fade-in-down">
            {eventHallCategory?.en_title || 'Event Halls'}
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-gray-200 max-w-3xl animate-fade-in-up leading-relaxed">
            اجعل مناسباتك الخاصة ذكرى لا تُنسى. ابحث عن القاعة المثالية لك.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-6">ابحث عن قاعتك المثالية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">

            <div className="lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">التقييم</label>
              <div className="relative">
                <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none">
                  {[0, 1, 2, 3, 4].map((rate) => <option key={rate} value={rate}>{rate === 0 ? "كل التقييمات" : `${rate}+ نجوم`}</option>)}
                </select>
              </div>
            </div>

            <div className="lg:col-span-1">
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
                <input type="number" min="0" placeholder="e.g., 2500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-orange-400 font-bold mb-2">السعة (الأدنى)</label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" placeholder="e.g., 200" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>

            <button onClick={handleResetFilters} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">إعادة تعيين</button>
          </div>
        </div>

        {/* --- قسم عرض النتائج --- */}
        <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-white transition-opacity duration-500">
                {loading ? 'جاري البحث عن أفضل القاعات...' : `وجدنا لك ${filteredHalls.length} قاعة`}
            </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, idx) => <ItemCardSkeleton key={idx} />)}
          </div>
        ) : filteredHalls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHalls.map((hall) => {
              const ratingInfo = mockRatings.find(r => r.rateable_type === 'event_hall' && r.rateable_id === hall.id);
              return (
                <div key={hall.id} className="animate-fade-in-up-item">
                  <ItemCard item={hall} loading={false} type="event_hall" rating={ratingInfo || null} />
                </div>
              );
            })}
          </div>
        ) : (
            <div className="text-center py-20 animate-fade-in-up-item">
                <FaCalendarCheck className="text-7xl text-gray-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-400">لا توجد قاعات تطابق بحثك</h2>
                <p className="text-lg text-gray-500 mt-2">جرّب تغيير كلمات البحث أو تعديل الفلاتر.</p>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventHallsPage;