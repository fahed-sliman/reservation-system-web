

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { RateableType, RatingInfo, Hotel, Restaurant, EventHall, PlayGround, Tour } from '../../types';
import StarRating from '../Rattings/StarRating';
import ItemCardSkeleton from './ItemCardSkeleton';

type CardItem = Hotel | Restaurant | EventHall | PlayGround | Tour;

interface ItemCardProps {
  item?: CardItem;
  loading: boolean;
  type: RateableType;
  rating?: RatingInfo | null;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, loading, type, rating }) => {
  const navigate = useNavigate();

  if (loading || !item) {
    return <ItemCardSkeleton />;
  }

  const getTitle = () => ({
    en: item.en_title ?? 'No Title',
    ar: item.ar_title ?? 'بدون عنوان',
  });

  const getLocation = () => 'ar_location' in item ? item.ar_location : ('location' in item ? item.location : '');

  const getPrice = () => ('price' in item && typeof item.price === 'number') ? `$${item.price.toFixed(2)}` : null;

  // ✅ تصحيح: تم تعديل المسار ليطابق Route في App.tsx
  const handleNavigation = () => {
    if (!item) return;
    navigate(`/details/${type}/${item.id}`);
  };
  
  const handleRoomsNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item) return;
    navigate(`/hotel-rooms/${item.id}`);
  };

  return (
    <div 
      className="bg-gray-800/50 rounded-2xl shadow-lg group transition-all duration-300 ease-in-out border border-gray-700/50 hover:shadow-xl hover:shadow-orange-500/20 hover:border-orange-500/50 transform hover:-translate-y-2 flex flex-col h-full cursor-pointer"
      onClick={handleNavigation}
    >
      <div className="relative rounded-t-2xl overflow-hidden">
        <img
          src={item.image ?? 'default-image.png'}
          alt={getTitle().en}
          className="w-full h-60 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">{getTitle().en}</h3>
          <p className="text-gray-200 drop-shadow-md">{getTitle().ar}</p>
        </div>
        {getLocation() && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {getLocation()}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          {rating ? <StarRating rating={rating.rating} /> : <div className="h-5" />}
          {getPrice() && <p className="text-xl font-bold text-orange-400">{getPrice()}</p>}
        </div>
        
        <div className="flex-grow"></div> 

        <div className="mt-4 w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // منع النقر على البطاقة الأم
              handleNavigation();
            }}
            className="cursor-pointer w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:bg-orange-500 hover:shadow-orange-500/30 transform group-hover:scale-105"
          >
            عرض التفاصيل
          </button>
          
          {type === 'hotel' && (
            <button
              onClick={handleRoomsNavigation}
              className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:bg-blue-500 hover:shadow-blue-500/30 transform group-hover:scale-105"
            >
              مشاهدة الغرف
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;