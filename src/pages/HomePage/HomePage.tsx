

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';



import { mockCategories, mockFeaturedItems, mockRatings } from '../../data/mockdata';
import type { RateableType, Hotel, Restaurant, EventHall, PlayGround, Tour } from '../../types';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WhyChooseUs from '../../components/HomeCopo/WhyChooseUs';
import CallToAction from '../../components/HomeCopo/CallToAction';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/Footer';
import ItemCard from '../../components/MinCard/ItemCard';


type FeaturedItem = Hotel | Restaurant | EventHall | PlayGround | Tour;

const typeMap: Record<number, RateableType> = {
  1: 'hotel',
  2: 'event_hall',
  3: 'restaurant',
  4: 'playground',
  5: 'tour',
};

const categoryPaths: Record<number, string> = {
  1: '/hotels',
  2: '/eventhalls',
  3: '/restaurants',
  4: '/playgrounds',
  5: '/tours',
};

const sliderDescriptions: Record<number, string> = {
    1: "عش تجربة الفخامة والراحة في أفضل الفنادق المختارة. إقامة لا تُنسى تنتظرك.",
    2: "حوّل مناسباتك الخاصة إلى ذكريات خالدة في قاعاتنا المجهزة بالكامل.",
    3: "تذوق أشهى الأطباق العالمية والمحلية في مطاعم تلبي كل الأذواق.",
    4: "مساحات لعب آمنة وممتعة تطلق العنان لخيال أطفالك وطاقتهم.",
    5: "انطلق في مغامرات لا مثيل لها واستكشف أروع المعالم والجولات السياحية."
};


// === Hero Slider Component ===
const HeroSlider = () => {
  const settings = {
    dots: true, infinite: true, speed: 1200, slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 4000, fade: true, pauseOnHover: true,
  };
  const customSliderStyles = `
    .slick-dots { bottom: 40px; z-index: 10; }
    .slick-dots li button:before { font-size: 12px; color: white; opacity: 0.7; }
    .slick-dots li.slick-active button:before { color: #f97316; opacity: 1; transform: scale(1.6); }
  `;
  return (
    <div className="relative h-screen bg-gray-900">
      <style>{customSliderStyles}</style>
      <Slider {...settings}>
        {mockCategories.map((cat) => (
          <div key={cat.id} className="h-screen relative">
            <img src={cat.image} alt={cat.en_title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8 space-y-6">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-wider drop-shadow-2xl animate-fade-in-down">{cat.en_title}</h2>
              <p className="text-lg md:text-2xl text-gray-200 max-w-3xl drop-shadow-lg animate-fade-in-up leading-relaxed">
                {sliderDescriptions[cat.id]}
              </p>
              <Link to={categoryPaths[cat.id] || '/home'} className="bg-orange-500 text-white px-10 py-4 mt-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                استكشف {cat.ar_title} الآن
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// === Featured Section Component ===
const FeaturedSection = ({ category, loading }: { category: any; loading: boolean }) => {
  const type = typeMap[category.id];
  const items: FeaturedItem[] = (mockFeaturedItems[category.id as keyof typeof mockFeaturedItems] || []).slice(0, 3);
  if (items.length === 0 && !loading) return null;
  return (
    <section className="mb-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          وجهات مميزة: <span className="text-orange-400">{category.ar_title}</span>
        </h2>
        <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">أفضل الأماكن التي نوصي بها والتي تتمتع بتقييمات عالية لضمان تجربة لا تُنسى.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {(loading ? Array(3).fill(undefined) : items).map((item, index) => (
          <ItemCard key={item?.id ?? `skeleton-${index}`} loading={loading} item={item} type={type}
            rating={item ? mockRatings.find(r => r.rateable_type === type && r.rateable_id === item.id) : null}
          />
        ))}
      </div>
    </section>
  );
};




// === المكون الرئيسي للصفحة الرئيسية ===
const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      <Header />
      
      <HeroSlider />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {mockCategories.map((cat) => (
              <FeaturedSection key={cat.id} category={cat} loading={loading} />
            ))}
        </div>
      </main>

      <WhyChooseUs />

      <CallToAction />
      
      <Footer />
    </div>
  );
};

export default HomePage;