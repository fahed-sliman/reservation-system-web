import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Skeleton from "react-loading-skeleton"; // استيراد skeleton
import "react-loading-skeleton/dist/skeleton.css"; // أنماط skeleton
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


type Category = {
  id: number;
  ar_title: string;
  en_title: string;
  image: string;
  created_at: string;
  updated_at: string;
};

type Hotel = {
  id: number;
  category_id: number;
  category_name: string;
  ar_title: string;
  en_title: string;
  image: string;
  ar_location: string;
  en_location: string;
  created_at: string;
  updated_at: string;
};

type EventHall = {
  id: number;
  category_id: number;
  ar_title: string;
  en_title: string;
  image: string;
  ar_location: string;
  en_location: string;
  capicity: number;
  price: number;
  is_closed: boolean;
  closed_from: string | null;
  closed_until: string | null;
  created_at: string;
  updated_at: string;
};

type Restaurant = {
  id: number;
  category_id: number;
  ar_title: string;
  en_title: string;
  image: string;
  location: string;
  capacity: number;
  is_closed: boolean;
  closed_from: string | null;
  closed_until: string | null;
  created_at: string;
  updated_at: string;
};

type PlayGround = {
  id: number;
  category_id: number;
  sport: string;
  ar_title: string;
  en_title: string;
  image: string;
  en_location: string;
  ar_location: string;
  price: number;
  capicity: number;
  is_closed: boolean;
  closed_from: string | null;
  closed_until: string | null;
  created_at: string;
  updated_at: string;
};

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const sampleCategories: Category[] = [
  {
    id: 1,
    ar_title: "فنادق",
    en_title: "Hotels",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8b0e0b973ca?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 2,
    ar_title: "صالات مناسبات",
    en_title: "Event Halls",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 3,
    ar_title: "مطاعم",
    en_title: "Restaurants",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 4,
    ar_title: "ملاعب",
    en_title: "Playgrounds",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 5,
    ar_title: "رحلات سياحية",
    en_title: "Tours",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
];

const featuredHotels: Hotel[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "Hotels",
    ar_title: "فندق النخيل",
    en_title: "Palm Hotel",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8b0e0b973ca?auto=format&fit=crop&w=600&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Hotels",
    ar_title: "فندق الشام",
    en_title: "Sham Hotel",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 3,
    category_id: 1,
    category_name: "Hotels",
    ar_title: "فندق البحر",
    en_title: "Sea Hotel",
    image:
      "https://images.unsplash.com/photo-1486308510493-cb57631b6c84?auto=format&fit=crop&w=600&q=80",
    ar_location: "اللاذقية",
    en_location: "Latakia",
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
];

const featuredEventHalls: EventHall[] = [
  {
    id: 1,
    category_id: 2,
    ar_title: "قاعة الفرح",
    en_title: "Joy Hall",
    image:
      "https://images.unsplash.com/photo-1542826438-f44b4a5b8dfd?auto=format&fit=crop&w=600&q=80",
    ar_location: "حلب",
    en_location: "Aleppo",
    capicity: 300,
    price: 2000,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 2,
    category_id: 2,
    ar_title: "قاعة القصر",
    en_title: "Palace Hall",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    ar_location: "دمشق",
    en_location: "Damascus",
    capicity: 500,
    price: 3500,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 3,
    category_id: 2,
    ar_title: "قاعة اللؤلؤة",
    en_title: "Pearl Hall",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    ar_location: "حمص",
    en_location: "Homs",
    capicity: 200,
    price: 1500,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
];

const featuredRestaurants: Restaurant[] = [
  {
    id: 1,
    category_id: 3,
    ar_title: "مطعم الزهراء",
    en_title: "Zahraa Restaurant",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
    location: "دمشق",
    capacity: 120,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 2,
    category_id: 3,
    ar_title: "مطعم الأندلس",
    en_title: "Andalus Restaurant",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    location: "حمص",
    capacity: 150,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 3,
    category_id: 3,
    ar_title: "مطعم الفردوس",
    en_title: "Firdaws Restaurant",
    image:
      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80",
    location: "حلب",
    capacity: 100,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
];

const featuredPlaygrounds: PlayGround[] = [
  {
    id: 1,
    category_id: 4,
    sport: "Football",
    ar_title: "ملعب النصر",
    en_title: "Nasr Football Ground",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    en_location: "دمشق",
    ar_location: "دمشق",
    price: 500,
    capicity: 50,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 2,
    category_id: 4,
    sport: "Basketball",
    ar_title: "ملعب الهلال",
    en_title: "Hilal Basketball Court",
    image:
      "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d6?auto=format&fit=crop&w=600&q=80",
    en_location: "حلب",
    ar_location: "حلب",
    price: 400,
    capicity: 40,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
  {
    id: 3,
    category_id: 4,
    sport: "Tennis",
    ar_title: "ملعب الفردوس",
    en_title: "Firdaws Tennis Court",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    en_location: "حمص",
    ar_location: "حمص",
    price: 300,
    capicity: 30,
    is_closed: false,
    closed_from: null,
    closed_until: null,
    created_at: "2025-06-27",
    updated_at: "2025-06-27",
  },
];

const featuredTours = [
  {
    id: 1,
    category_id: 5,
    ar_title: "رحلة البتراء",
    en_title: "Petra Tour",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    location: "الأردن",
    description:
      "رحلة سياحية مميزة لاستكشاف مدينة البتراء التاريخية وأجواء الصحراء.",
  },
  {
    id: 2,
    category_id: 5,
    ar_title: "رحلة الغردقة",
    en_title: "Hurghada Tour",
    image:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=600&q=80",
    location: "مصر",
    description:
      "استمتع بالشواطئ والأنشطة البحرية في الغردقة مع مجموعة مميزة من الرحلات.",
  },
  {
    id: 3,
    category_id: 5,
    ar_title: "رحلة إسطنبول",
    en_title: "Istanbul Tour",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    location: "تركيا",
    description:
      "زيارة المعالم السياحية والثقافية في إسطنبول مع جولات مخصصة وتاريخ غني.",
  },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(sampleCategories);

  // محاكاة تحميل بيانات لمدة 1.5 ثانية
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // فلترة حسب النص المكتوب بالبحث
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(sampleCategories);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();

    // نفلتر الأقسام التي تطابق الاسم العربي أو الإنجليزي أو تحتوي على عناصر مطابقة
    const filtered = sampleCategories.filter((cat) => {
      const matchCategory =
        cat.ar_title.toLowerCase().includes(lowerSearch) ||
        cat.en_title.toLowerCase().includes(lowerSearch);

      if (matchCategory) return true;

      // بحث داخل العناصر حسب القسم
      const items = allFeatured[cat.id] || [];
      // لو وجدنا عنصر يطابق الاسم العربي أو الإنجليزي أو المواقع أو الوصف
      const hasMatchingItem = items.some((item: any) => {
        // نأخذ كل القيم المهمة من العنصر كـ string ونبحث داخله
        const searchFields = [
          item.ar_title,
          item.en_title,
          item.ar_location || item.location || "",
          item.en_location || item.location || "",
          item.description || "",
          item.sport || "",
        ].map((f) => f.toLowerCase());

        return searchFields.some((field) => field.includes(lowerSearch));
      });

      return hasMatchingItem;
    });

    setFilteredCategories(filtered);
  }, [searchTerm]);

  // إعدادات السلايدر كما هي
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            paddingTop: "1rem",
            margin: 0,
          }}
        >
          {React.Children.map(dots, (dot: any) =>
            React.cloneElement(dot, {
              style: {
                ...dot.props.style,
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: dot.props.className.includes("slick-active")
                  ? "2px solid #f97316"
                  : "2px solid black",
                backgroundColor: "transparent",
                cursor: "pointer",
              },
            })
          )}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          border: "2px solid black",
          backgroundColor: "transparent",
        }}
      />
    ),
  };

  const allFeatured: Record<number, any[]> = {
    1: featuredHotels,
    2: featuredEventHalls,
    3: featuredRestaurants,
    4: featuredPlaygrounds,
    5: featuredTours,
  };

  const cardHeight = 420;
  const cardWidth = 320;

  const renderSection = (cat: Category) => {
    const items = allFeatured[cat.id] || [];

    return (
      <section
        key={cat.id}
        id={`cat-${cat.id}`}
        className="min-h-screen px-6 py-20 max-w-7xl mx-auto"
      >
        {/* تكبير الخط البرتقالي: */}
        <h2 className="text-5xl font-extrabold text-orange-500 mb-10 text-center">
          {cat.en_title} / {cat.ar_title}
        </h2>

        <div
          className="flex flex-wrap justify-center gap-8 perspective-1000"
          style={{ maxWidth: cardWidth * 3 + 32 * 2 }}
        >
          {loading
            ? // عرض skeleton أثناء التحميل (عدد 3 بطاقات)
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl overflow-hidden shadow-2xl bg-[#1a1f27] flex flex-col"
                    style={{ height: cardHeight, width: cardWidth }}
                  >
                    <Skeleton height={192} /> {/* Skeleton للصورة (48 * 4 = 192px) */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <Skeleton height={32} width="70%" style={{ marginBottom: 8 }} />
                      <Skeleton height={24} width="50%" />
                      <Skeleton height={20} count={3} style={{ marginTop: 8 }} />
                      <Skeleton height={36} width="100%" style={{ marginTop: 16, borderRadius: 12 }} />
                    </div>
                  </div>
                ))
            : items.length > 0 ? (
                items.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-3xl overflow-hidden shadow-2xl bg-[#1a1f27] flex flex-col 
                  hover:shadow-xl hover:shadow-orange-600/50"
                    style={{
                      height: cardHeight,
                      width: cardWidth,
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                    }}
                    onMouseMove={(e) => {
                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = ((y - centerY) / centerY) * 10; // max 10deg rotateX
                      const rotateY = ((x - centerX) / centerX) * 10; // max 10deg rotateY
                      card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                    }}
                  >
                    <img
                      src={item.image || DEFAULT_AVATAR}
                      alt={item.en_title}
                      className="w-full h-48 object-cover rounded-t-3xl"
                    />
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <h4 className="text-2xl font-bold text-orange-500 mb-2 truncate">
                        {item.en_title}
                      </h4>
                      <p className="text-lg text-gray-300 truncate">
                        {item.ar_location || item.location}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <button className="cursor-pointer mt-auto px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
                        تفاصيل
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 w-full">لا توجد نتائج للبحث.</p>
              )}
        </div>

        {/* الخط البرتقالي الصغير بين الأقسام */}
        <hr className="my-12 border-orange-500 border-t-2 w-24 mx-auto rounded" />
      </section>
    );
  };

  return (
    <div className="bg-[#111416] text-white min-h-screen flex flex-col relative">
      {/* Header ثابت فوق الصورة بدون خلفية ملونة */}
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <h1 className="text-2xl font-bold text-orange-500 tracking-wide">ReserGo</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="category-list"
              className="px-3 py-1.5 rounded-full text-black placeholder-gray-500 bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            />
            <datalist id="category-list">
              {sampleCategories.map((cat) => (
                <option key={cat.id} value={cat.en_title} />
              ))}
            </datalist>
            <img
              src={DEFAULT_AVATAR}
              alt="Profile"
              className="w-8 h-8 rounded-full border-transparent-2 hover:border-orange-500-2"
            />
          </div>
        </nav>
      </header>

      {/* السلايدر يأخذ 100vh */}
      <section className="relative h-screen ">
        <Slider {...sliderSettings}>
          {sampleCategories.map((cat) => (
            <div key={cat.id} className="relative h-screen">
              <img src={cat.image} alt={cat.en_title} className="w-full h-full  object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/60">
                <h2 className="text-6xl font-extrabold text-white drop-shadow-xl">
                  {cat.en_title} / {cat.ar_title}
                </h2>
                <button className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-xl transition duration-300">
                  احجز الآن
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* عرض الأقسام المفلترة */}
      {loading
        ? // يمكن عرض skeleton بشكل عام هنا لو حبيت
          null
        : filteredCategories.length > 0
        ? filteredCategories.map((cat) => renderSection(cat))
        : (
          <p className="text-center text-gray-400 py-20 text-xl w-full">
            لم يتم العثور على نتائج تطابق بحثك.
          </p>
        )}

      {/* Footer */}
      <footer className="bg-[#22272e] text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-orange-500 font-bold text-lg mb-2">حول الموقع</h3>
            <p className="max-w-sm">
              موقع ReserGo يوفر لك حجز الفنادق، صالات المناسبات، المطاعم، الملاعب والرحلات السياحية بطريقة سهلة وسريعة.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-orange-500 font-bold text-lg mb-2">المطورون</h3>
            <ul>
              <li>فهد سليمان</li>
              <li>محمد الأحمد</li>
              <li>سارة العلي</li>
            </ul>
          </div>
          <div className="text-center md:text-right text-sm">
            &copy; {new Date().getFullYear()} ReserGo. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;