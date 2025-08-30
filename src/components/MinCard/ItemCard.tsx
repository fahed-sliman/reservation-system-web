

import React from "react";
import { useNavigate } from "react-router-dom";
import type { RateableType, Hotel, Restaurant, EventHall, PlayGround, Tour } from "../../types";
import StarRating from "../Rattings/StarRating";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

type CardItem = Hotel | Restaurant | EventHall | PlayGround | Tour;

interface ItemCardProps {
  item?: CardItem;
  loading: boolean;
  type: RateableType;
  rating?: number;
  showStatus?: boolean; // ✅ 1. إضافة الخاصية الجديدة
}

const ItemCard: React.FC<ItemCardProps> = ({ item, loading, type, rating, showStatus = true }) => { // ✅ 2. تعيين قيمة افتراضية
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading || !item) return <ItemCardSkeleton />;

  const getTitle = () => (language === "ar" ? item.ar_title || "بدون عنوان" : item.en_title || "No Title");
  const getLocation = () => {
    if ("ar_location" in item) return language === "ar" ? item.ar_location || item.en_location : item.en_location || item.ar_location;
    if ("location" in item) return item.location;
    return "";
  };
  const getImageSrc = () => {
    if (!item.image) return "/images/default-image.png";
    return item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000/storage/${item.image}`;
  };

  const getStatus = () => {
    if (type === "tour") return "";
    if ("is_closed" in item && item.is_closed !== undefined)
      return item.is_closed ? (language === "ar" ? "مغلق" : "Closed") : (language === "ar" ? "مفتوح" : "Open");
    return language === "ar" ? "مفتوح" : "Open";
  };

  const handleNavigation = () => navigate(`/details/${type}/${item.id}`);
  const handleRoomsNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/hotel-rooms/${item.id}`);
  };

  return (
    <div
      className={`rounded-2xl shadow-md group transition-all duration-300 ease-in-out border hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50 transform hover:-translate-y-2 flex flex-col h-full cursor-pointer
      ${isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white border-gray-200"}`}
      onClick={handleNavigation}
    >
      <div className="relative rounded-t-2xl overflow-hidden">
        <img
          src={getImageSrc()}
          alt={getTitle()}
          className="w-full h-60 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">{getTitle()}</h3>
          
          {/* ✅ 3. إضافة شرط لعرض الحالة */}
          {showStatus && (
            <p
              className={`text-sm font-semibold mt-1 ${
                getStatus() === "مفتوح" || getStatus() === "Open" ? "text-green-400" : "text-red-500"
              }`}
            >
              {getStatus()}
            </p>
          )}
        </div>

        {getLocation() && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {getLocation()}
          </div>
        )}

        {"price" in item && item.price && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {language === "ar" ? `السعر: €${item.price}` : `Price: €${item.price}`}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <StarRating rating={rating ?? 0} />
        </div>

        <div className="flex-grow"></div>

        <div className="mt-4 w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
            className="cursor-pointer w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:bg-orange-500 hover:shadow-orange-500/30 transform group-hover:scale-105"
          >
            {language === "ar" ? "عرض التفاصيل" : "View Details"}
          </button>

          {type === "hotel" && (
            <button
              onClick={handleRoomsNavigation}
              className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:bg-blue-500 hover:shadow-blue-500/30 transform group-hover:scale-105"
            >
              {language === "ar" ? "مشاهدة الغرف" : "View Rooms"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;