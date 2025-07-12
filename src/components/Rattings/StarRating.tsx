// import React from "react";

// interface StarRatingProps {
//   rating: number;
//   max?: number;
//   size?: number; // حجم النجمة بالبيكسل
// }

// const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, size = 20 }) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5;
//   const emptyStars = max - fullStars - (halfStar ? 1 : 0);

//   const StarFull = (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="gold"
//       stroke="goldenrod"
//       strokeWidth="1"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="drop-shadow-lg"
//     >
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );

//   const StarHalf = (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="url(#halfGradient)"
//       stroke="goldenrod"
//       strokeWidth="1"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="drop-shadow-lg"
//     >
//       <defs>
//         <linearGradient id="halfGradient">
//           <stop offset="50%" stopColor="gold" />
//           <stop offset="50%" stopColor="transparent" />
//         </linearGradient>
//       </defs>
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );

//   const StarEmpty = (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="#cbd5e1"
//       strokeWidth="1"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="drop-shadow-sm"
//     >
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );

//   return (
//     <div className="flex items-center gap-1">
//       {[...Array(fullStars)].map((_, i) => (
//         <span key={`full-${i}`}>{StarFull}</span>
//       ))}
//       {halfStar && <span>{StarHalf}</span>}
//       {[...Array(emptyStars)].map((_, i) => (
//         <span key={`empty-${i}`}>{StarEmpty}</span>
//       ))}
//     </div>
//   );
// };

// export default StarRating;

// src/components/StarRating.tsx

import React from 'react';

// أضفنا الخاصيتين interactive و setRating لجعل المكون تفاعلياً
interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  setRating?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5, 
  size = 24, 
  interactive = false, 
  setRating 
}) => {
  // دالة يتم استدعاؤها عند الضغط على نجمة
  const handleStarClick = (starIndex: number) => {
    if (interactive && setRating) {
      setRating(starIndex + 1);
    }
  };

  const StarFull = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="gold" stroke="goldenrod" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const StarEmpty = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <div className={`flex items-center gap-1 ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(max)].map((_, i) => (
        <span 
          key={`star-${i}`} 
          onClick={() => handleStarClick(i)} 
          className="transition-transform duration-200 hover:scale-125"
        >
          {/* ✅ المنطق الرئيسي: إذا كان مؤشر النجمة أصغر من التقييم، تكون ممتلئة */}
          {i < rating ? StarFull : StarEmpty}
        </span>
      ))}
    </div>
  );
};

export default StarRating;