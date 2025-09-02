import React, { useState, useEffect, useCallback, FC } from 'react';
import { FaCalendarAlt, FaUsers, FaBuilding, FaTicketAlt } from 'react-icons/fa';
import type { ReserveRestaurantRequest } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { toast } from 'react-hot-toast'; // ✅ استيراد toast

interface ReserveRestaurantFormProps {
  restaurantId: number;
  onClose: () => void;
}

const translations = {
  ar: {
    reservationDateTime: "تاريخ ووقت الحجز",
    guests: "عدد الضيوف",
    seatingArea: "مكان الجلوس",
    indoorHall: "صالة داخلية",
    outdoorTerrace: "تراس خارجي",
    couponCode: "كود الكوبون (اختياري)",
    couponPlaceholder: "أدخل الكود هنا إن وجد",
    submitButton: "تأكيد الحجز",
    submittingButton: "جاري التأكيد...",
    successMessage: "تم إرسال طلب حجز الطاولة بنجاح!",
    errorMessage: "عذراً، حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.",
    dateTimeRequired: "حقل تاريخ ووقت الحجز مطلوب.",
    guestsRequired: "يجب أن يكون عدد الضيوف شخصاً واحداً على الأقل.",
  },
  en: {
    reservationDateTime: "Reservation Date & Time",
    guests: "Number of Guests",
    seatingArea: "Seating Area",
    indoorHall: "Indoor Hall",
    outdoorTerrace: "Outdoor Terrace",
    couponCode: "Coupon Code (Optional)",
    couponPlaceholder: "Enter code here if you have one",
    submitButton: "Confirm Booking",
    submittingButton: "Confirming...",
    successMessage: "Table reservation request sent successfully!",
    errorMessage: "Sorry, an error occurred while sending the booking. Please try again.",
    dateTimeRequired: "Date and time field is required.",
    guestsRequired: "Number of guests must be at least 1.",
  },
};

const ReserveRestaurantForm: FC<ReserveRestaurantFormProps> = ({ restaurantId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  
  const [formData, setFormData] = useState<Omit<ReserveRestaurantRequest, 'restaurantId'>>({
    reservationDateTime: '',
    guests: 1,
    areaType: 'indoor_hall',
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.reservationDateTime) newErrors.reservationDateTime = t('dateTimeRequired');
    if (!formData.guests || formData.guests < 1) newErrors.guests = t('guestsRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const completeFormData: ReserveRestaurantRequest = { ...formData, restaurantId };
      try {
        console.log('Sending restaurant booking data:', completeFormData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // ✅ عرض toast نجاح
        toast.success(t('successMessage'));
        setTimeout(onClose, 2000);
      } catch (error) {
        // ✅ عرض toast خطأ
        toast.error(t('errorMessage'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
  };

  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500'
      : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'
  }`;
  
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="reservationDateTime" className={labelClasses}>{t('reservationDateTime')}</label>
        <div className="relative">
          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="datetime-local" id="reservationDateTime" name="reservationDateTime" value={formData.reservationDateTime} onChange={handleChange} className={inputClasses} style={{ colorScheme: theme }} />
        </div>
        {errors.reservationDateTime && <p className="text-red-400 text-sm mt-1">{errors.reservationDateTime}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="guests" className={labelClasses}>{t('guests')}</label>
          <div className="relative">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} className={inputClasses} />
          </div>
          {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests}</p>}
        </div>
        <div>
          <label htmlFor="areaType" className={labelClasses}>{t('seatingArea')}</label>
          <div className="relative">
            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select id="areaType" name="areaType" value={formData.areaType} onChange={handleChange} className={inputClasses}>
              <option value="indoor_hall">{t('indoorHall')}</option>
              <option value="outdoor_terrace">{t('outdoorTerrace')}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="couponCode" className={`block font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('couponCode')}</label>
        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode ?? ''} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <hr className={`!my-8 ${theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200'}`} />
      
      <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
};

export default ReserveRestaurantForm;
