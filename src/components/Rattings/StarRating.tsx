import React from 'react';

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

  const handleStarClick = (starIndex: number) => {
    if (interactive && setRating) {
      setRating(starIndex + 1);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(max)].map((_, i) => {
        let starType;
        if (i + 1 <= Math.floor(rating)) starType = 'full';
        else if (i + 1 - rating <= 0.5) starType = 'half';
        else starType = 'empty';

        return (
          <span key={`star-${i}`} onClick={() => handleStarClick(i)} className="transition-transform duration-200 hover:scale-125">
            {starType === 'full' && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="gold" stroke="goldenrod" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {starType === 'half' && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="gold" stroke="goldenrod" strokeWidth="1">
                <defs>
                  <linearGradient id="halfGrad">
                    <stop offset="50%" stopColor="gold" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfGrad)" stroke="goldenrod" />
              </svg>
            )}
            {starType === 'empty' && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
