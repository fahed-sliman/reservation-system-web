import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "../../components/Header/header";
import Footer from "../../components/Footer/Footer";
import HeroSliderSkeleton from "../../components/HomeCopo/HeroSliderSkeleton";
import ItemCard from "../../components/MinCard/ItemCard";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import CallToAction from "./components/CallToAction";
import WhyChooseUs from "./components/WhyChooseUs";

export type RateableType = "hotel" | "restaurant" | "event_hall" | "playground" | "tour";

interface Category {
  id: number;
  ar_title: string;
  en_title: string;
  image: string;
}

interface ApiPlace {
  id: number;
  name: string;
  image: string;
  average_rating: number;
  type: string;
  price?: number;
}

export interface CardItem {
  id: number;
  ar_title: string;
  en_title: string;
  image?: string;
  average_rating?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const apiTypeMap: Record<RateableType, string> = {
  hotel: "Hotel", restaurant: "Restaurant", event_hall: "EventHall",
  playground: "PlayGround", tour: "Tours",
};

const idToType: Record<number, RateableType> = {
  1: "hotel", 2: "restaurant", 3: "event_hall",
  4: "playground", 5: "tour",
};

const categoryPaths: Record<number, string> = {
  1: "/hotels", 2: "/restaurants", 3: "/eventhalls",
  4: "/playgrounds", 5: "/tours",
};

const sliderDescriptions: Record<number, { ar: string; en: string }> = {
    1: { ar: "عش تجربة الفخامة والراحة في أفضل الفنادق المختارة. إقامة لا تُنسى تنتظرك.", en: "Experience luxury and comfort in the best-selected hotels. An unforgettable stay awaits you." },
    3: { ar: "حوّل مناسباتك الخاصة إلى ذكريات خالدة في قاعاتنا المجهزة بالكامل.", en: "Turn your special occasions into timeless memories in our fully equipped halls." },
    2: { ar: "تذوق أشهى الأطباق العالمية والمحلية في مطاعم تلبي كل الأذواق.", en: "Savor the most delicious international and local dishes in restaurants that cater to all tastes." },
    4: { ar: "مساحات لعب آمنة وممتعة تطلق العنان لخيال أطفالك وطاقتهم.", en: "Safe and fun play areas that unleash your children's imagination and energy." },
    5: { ar: "انطلق في مغامرات لا مثيل لها واستكشف أروع المعالم والجولات السياحية.", en: "Embark on unparalleled adventures and explore the most wonderful landmarks and tours." }
};

const getImageUrl = (image?: string): string => {
  if (!image) return "/placeholder-image.jpg";
  const cleaned = image.trim().replace(/\r?\n|\r/g, "");
  if (cleaned.startsWith("http")) return cleaned;
  const base = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
  return cleaned.startsWith("storage/") ? `${base}/${cleaned}` : `${base}/storage/${cleaned}`;
};

const mapApiPlaceToCardItem = (p: ApiPlace): CardItem => ({
  id: p.id, ar_title: p.name, en_title: p.name,
  image: getImageUrl(p.image), average_rating: p.average_rating,
});

const HeroSlider: React.FC<{ categories: Category[]; loading: boolean }> = ({ categories, loading }) => {
  const { language } = useLanguage();

  if (loading) return <HeroSliderSkeleton />;
  if (!categories?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-2xl opacity-70">{language === "ar" ? "لا توجد فئات" : "No Categories Found"}</h2>
      </div>
    );
  }
  
  const settings = {
    dots: true, infinite: true, speed: language === "en" ? 1200 : 500,
    slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000,
    pauseOnHover: true, rtl: language === "ar", fade: language === "en",
  };

  const customSliderStyles = `
    .slick-dots { bottom: 40px; z-index: 10; }
    .slick-dots li button:before { font-size: 12px; color: white; opacity: 0.7; }
    .slick-dots li.slick-active button:before { color: #f97316; opacity: 1; transform: scale(1.6); }
  `;

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      <style>{customSliderStyles}</style>
      <Slider {...settings}>
        {categories.map((cat) => {
          const title = language === "ar" ? cat.ar_title : cat.en_title;
          const description = sliderDescriptions[cat.id]?.[language] ?? '';
          
          return (
            <div key={cat.id} className="h-screen relative">
              <img src={getImageUrl(cat.image)} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-wider drop-shadow-2xl">{title}</h2>
                <p className="text-lg md:text-2xl text-gray-200 max-w-3xl drop-shadow-lg leading-relaxed">{description}</p>
                <Link to={categoryPaths[cat.id] || "/"} className="bg-orange-500 text-white px-10 py-4 mt-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  {language === "ar" ? `استكشف ${cat.ar_title} الآن` : `Explore ${cat.en_title} Now`}
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

const CategoryFeaturedSection: React.FC<{ 
  category: Category; 
  items: CardItem[]; 
  loading: boolean;
  sectionRef: React.RefObject<HTMLElement>;
}> = ({ category, items, loading, sectionRef }) => {
  const { language } = useLanguage();
  const type = idToType[category.id];
  const title = language === "ar" ? category.ar_title : category.en_title;

  if (!loading && items.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      id={`section-${category.id}`} // ✅ إضافة ID للقسم
      className="mb-24 scroll-mt-24" // ✅ إضافة scroll margin للتعامل مع fixed header
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {language === "ar" ? "وجهات مميزة:" : "Featured Destinations:"}{" "}
          <span className="text-orange-500">{title}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(loading ? Array(3).fill(null) : items).map((it, idx) => (
          <ItemCard
            key={it?.id ?? `skeleton-${idx}`}
            loading={loading}
            item={it as any}
            type={type}
            rating={(it as CardItem)?.average_rating ?? 0}
            showStatus={false}
          />
        ))}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]); // ✅ لحفظ جميع الفئات
  const [featured, setFeatured] = useState<Record<RateableType, CardItem[]>>({
    hotel: [], restaurant: [], event_hall: [], playground: [], tour: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ حالة البحث

  // ✅ Refs للأقسام
  const sectionRefs = useRef<Record<number, React.RefObject<HTMLElement>>>({});

  const containerClasses = useMemo(() => theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900", [theme]);

  // ✅ إنشاء refs للأقسام
  useEffect(() => {
    categories.forEach(cat => {
      if (!sectionRefs.current[cat.id]) {
        sectionRefs.current[cat.id] = React.createRef<HTMLElement>();
      }
    });
  }, [categories]);

  // ✅ دالة البحث والتمرير
  const handleSearch = useCallback(async (searchValue: string) => {
    if (!searchValue.trim()) {
      setCategories(allCategories);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories?search=${encodeURIComponent(searchValue)}`, {
        headers: { "Accept-Language": language }
      });
      
      if (response.ok) {
        const data = await response.json();
        const foundCategories: Category[] = data?.data ?? [];
        setCategories(foundCategories);
        
        // ✅ التمرير للقسم الأول المطابق
        if (foundCategories.length > 0) {
          const firstCategory = foundCategories[0];
          const sectionRef = sectionRefs.current[firstCategory.id];
          if (sectionRef?.current) {
            sectionRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }
      } else {
        console.error('Search failed:', response.status);
        setCategories([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setCategories([]);
    }
  }, [language, allCategories]);

  // ✅ معالج تغيير البحث
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // البحث مع debouncing
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  // ✅ معالج الضغط على Enter
  const handleSearchSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  }, [handleSearch, searchTerm]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catRes = await fetch(`${API_BASE_URL}/categories`, { headers: { "Accept-Language": language } });
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const catJson = await catRes.json();
        const cats: Category[] = catJson?.data ?? [];
        if (!cancelled) {
          setCategories(cats);
          setAllCategories(cats); // ✅ حفظ جميع الفئات
        }

        const types = Array.from(new Set(cats.map((c) => idToType[c.id]).filter(Boolean) as RateableType[]));
        const requests = types.map(async (t) => {
          const res = await fetch(`${API_BASE_URL}/rating/bestRated?type=${apiTypeMap[t]}`);
          if (!res.ok) throw new Error(`Failed to fetch bestRated for ${t}`);
          const data = await res.json();
          const places: ApiPlace[] = data?.places ?? [];
          return [t, places.map(mapApiPlaceToCardItem).slice(0, 3)] as const;
        });

        const entries = await Promise.all(requests);
        const next: Record<RateableType, CardItem[]> = { hotel: [], restaurant: [], event_hall: [], playground: [], tour: [] };
        entries.forEach(([t, arr]) => { next[t] = arr; });
        if (!cancelled) setFeatured(next);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [language]);

  return (
    <div className={`${containerClasses} min-h-screen overflow-x-hidden`} dir={language === "ar" ? "rtl" : "ltr"}>
      <Header 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <HeroSlider categories={categories} loading={loading} />
      
      {/* ✅ عرض رسالة البحث */}
      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className="text-lg font-semibold">
              {language === "ar" 
                ? `نتائج البحث عن: "${searchTerm}"` 
                : `Search results for: "${searchTerm}"`}
            </p>
            {categories.length === 0 && !loading && (
              <p className="text-red-500 mt-2">
                {language === "ar" ? "لا توجد نتائج" : "No results found"}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-semibold">{language === "ar" ? "حدث خطأ" : "An error occurred"}</p>
            <p className="opacity-80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            // ✅ إنشاء ref لكل قسم
            if (!sectionRefs.current[cat.id]) {
              sectionRefs.current[cat.id] = React.createRef<HTMLElement>();
            }
            
            return (
              <CategoryFeaturedSection
                key={cat.id}
                category={cat}
                items={featured[idToType[cat.id]] || []}
                loading={loading}
                sectionRef={sectionRefs.current[cat.id]}
              />
            );
          })}
        </div>
      </main>
      <WhyChooseUs />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;