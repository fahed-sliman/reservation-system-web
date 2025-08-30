// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaHeart, FaMapMarkerAlt, FaStar, FaTrash, FaEye } from 'react-icons/fa';
// import Header from '../../components/Header/Header';
// import { useAuth } from '../../context/AuthContext';
// import { useLanguage } from '../../context/LanguageContext';
// import { useTheme } from '../../context/ThemeContext';

// interface Favorite {
//   id: number;
//   user_id: number;
//   favoritable_type: string;
//   favoritable_id: number;
//   created_at: string;
//   favoritable: {
//     id: number;
//     name: string;
//     description?: string;
//     location?: string;
//     price?: number;
//     rating?: number;
//     image_url?: string;
//     images?: string[];
//   };
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const FavoritesPage: React.FC = () => {
//   const { user } = useAuth();
//   const { language } = useLanguage();
//   const { theme } = useTheme();
  
//   const [favorites, setFavorites] = useState<Favorite[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

//   const texts = {
//     ar: {
//       title: "المفضلة",
//       subtitle: "جميع الأماكن والخدمات المفضلة لديك",
//       empty: "لا توجد عناصر في المفضلة",
//       emptyDesc: "ابدأ بإضافة أماكنك المفضلة لتجدها هنا بسهولة",
//       removeFromFavorites: "إزالة من المفضلة",
//       viewDetails: "عرض التفاصيل",
//       location: "الموقع",
//       rating: "التقييم",
//       price: "السعر",
//       perNight: "لكل ليلة",
//       currency: "ر.س",
//       loading: "جاري التحميل...",
//       removing: "جاري الإزالة...",
//       errorLoading: "حدث خطأ في تحميل المفضلة",
//       errorRemoving: "فشل في إزالة العنصر من المفضلة",
//       hotels: "فندق",
//       restaurants: "مطعم", 
//       eventhalls: "صالة أفراح",
//       playgrounds: "ملعب",
//       tours: "رحلة"
//     },
//     en: {
//       title: "Favorites",
//       subtitle: "All your favorite places and services",
//       empty: "No favorites found",
//       emptyDesc: "Start adding your favorite places to find them here easily",
//       removeFromFavorites: "Remove from favorites",
//       viewDetails: "View Details", 
//       location: "Location",
//       rating: "Rating",
//       price: "Price",
//       perNight: "per night",
//       currency: "SAR",
//       loading: "Loading...",
//       removing: "Removing...",
//       errorLoading: "Error loading favorites",
//       errorRemoving: "Failed to remove item from favorites",
//       hotels: "Hotel",
//       restaurants: "Restaurant",
//       eventhalls: "Event Hall", 
//       playgrounds: "Playground",
//       tours: "Tour"
//     }
//   };

//   const currentTexts = texts[language];

//   // جلب المفضلة من الخادم
//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!user) return;
      
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('authToken') || localStorage.getItem('token');
//         if (!token) throw new Error('No authentication token found');

//         const response = await fetch(`${API_BASE_URL}/api/user/favorites`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setFavorites(data.favorites || []);
//       } catch (err: any) {
//         console.error('Error fetching favorites:', err);
//         setError(err.message || currentTexts.errorLoading);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavorites();
//   }, [user, currentTexts.errorLoading]);

//   // إزالة عنصر من المفضلة
//   const removeFavorite = async (favoriteId: number) => {
//     setDeletingIds(prev => new Set(prev).add(favoriteId));

//     try {
//       const token = localStorage.getItem('authToken') || localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const response = await fetch(`${API_BASE_URL}/api/user/favorites/${favoriteId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // إزالة العنصر من القائمة محلياً
//       setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
//     } catch (err: any) {
//       console.error('Error removing favorite:', err);
//       alert(currentTexts.errorRemoving);
//     } finally {
//       setDeletingIds(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(favoriteId);
//         return newSet;
//       });
//     }
//   };

//   // تحديد نوع العنصر بالعربية
//   const getItemTypeInArabic = (type: string): string => {
//     const typeMap: { [key: string]: string } = {
//       'hotels': currentTexts.hotels,
//       'restaurants': currentTexts.restaurants,
//       'eventhalls': currentTexts.eventhalls,
//       'playgrounds': currentTexts.playgrounds,
//       'tours': currentTexts.tours,
//     };
//     return typeMap[type] || type;
//   };

//   // الحصول على الرابط الصحيح للتفاصيل
//   const getDetailsLink = (item: Favorite): string => {
//     const type = item.favoritable_type.toLowerCase();
//     return `/details/${type}/${item.favoritable_id}`;
//   };

//   // الحصول على صورة العنصر
//   const getItemImage = (item: Favorite): string => {
//     const favoritable = item.favoritable;
//     if (favoritable.image_url) {
//       return favoritable.image_url.startsWith('http') 
//         ? favoritable.image_url 
//         : `${API_BASE_URL}/storage/${favoritable.image_url}`;
//     }
//     if (favoritable.images && favoritable.images.length > 0) {
//       const firstImage = favoritable.images[0];
//       return firstImage.startsWith('http') 
//         ? firstImage 
//         : `${API_BASE_URL}/storage/${firstImage}`;
//     }
//     return '/placeholder-image.jpg';
//   };

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className={`min-h-screen pt-24 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//               <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {currentTexts.loading}
//               </p>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className={`min-h-screen pt-24 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center py-12">
//               <div className="text-red-500 text-6xl mb-4">⚠️</div>
//               <p className="text-red-500 text-lg mb-4">{error}</p>
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
//               >
//                 إعادة المحاولة
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className={`min-h-screen pt-24 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="max-w-7xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-12">
//             <div className="flex items-center justify-center mb-4">
//               <FaHeart className="text-4xl text-red-500 mr-3" />
//               <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                 {currentTexts.title}
//               </h1>
//             </div>
//             <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//               {currentTexts.subtitle}
//             </p>
//           </div>

//           {/* Favorites Grid */}
//           {favorites.length === 0 ? (
//             <div className="text-center py-16">
//               <FaHeart className="text-6xl text-gray-400 mx-auto mb-6" />
//               <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {currentTexts.empty}
//               </h2>
//               <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                 {currentTexts.emptyDesc}
//               </p>
//               <Link 
//                 to="/" 
//                 className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
//               >
//                 استكشف الآن
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {favorites.map((favorite) => (
//                 <div 
//                   key={favorite.id} 
//                   className={`rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
//                     theme === 'dark' ? 'bg-gray-800' : 'bg-white'
//                   }`}
//                 >
//                   {/* Image */}
//                   <div className="relative h-48 overflow-hidden">
//                     <img
//                       src={getItemImage(favorite)}
//                       alt={favorite.favoritable.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
//                       }}
//                     />
//                     <div className="absolute top-4 right-4">
//                       <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
//                         {getItemTypeInArabic(favorite.favoritable_type)}
//                       </span>
//                     </div>
//                     <div className="absolute top-4 left-4">
//                       <FaHeart className="text-red-500 text-xl" />
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                       {favorite.favoritable.name}
//                     </h3>
                    
//                     {favorite.favoritable.description && (
//                       <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                         {favorite.favoritable.description}
//                       </p>
//                     )}

//                     {/* Details */}
//                     <div className="space-y-2 mb-4">
//                       {favorite.favoritable.location && (
//                         <div className="flex items-center text-sm">
//                           <FaMapMarkerAlt className="text-orange-500 mr-2" />
//                           <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
//                             {favorite.favoritable.location}
//                           </span>
//                         </div>
//                       )}
                      
//                       {favorite.favoritable.rating && (
//                         <div className="flex items-center text-sm">
//                           <FaStar className="text-yellow-500 mr-2" />
//                           <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
//                             {favorite.favoritable.rating} / 5
//                           </span>
//                         </div>
//                       )}

//                       {favorite.favoritable.price && (
//                         <div className={`text-lg font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
//                           {favorite.favoritable.price} {currentTexts.currency}
//                           {favorite.favoritable_type === 'hotels' && (
//                             <span className="text-sm font-normal"> {currentTexts.perNight}</span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <Link
//                         to={getDetailsLink(favorite)}
//                         className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                       >
//                         <FaEye />
//                         {currentTexts.viewDetails}
//                       </Link>
                      
//                       <button
//                         onClick={() => removeFavorite(favorite.id)}
//                         disabled={deletingIds.has(favorite.id)}
//                         className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         title={currentTexts.removeFromFavorites}
//                       >
//                         {deletingIds.has(favorite.id) ? (
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         ) : (
//                           <FaTrash />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default FavoritesPage;

export default function FavoritesPage(){
  return <></>
}



