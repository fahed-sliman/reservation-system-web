import React, { useState, useEffect, useCallback, FC } from 'react';
import { FaCalendarAlt, FaClock, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import type { ReservePlayGroundRequest } from '../../../types';

// Contexts
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

// =================================================================
// ✅  الخطوة 1: تحديث قاموس الترجمة
// =================================================================
const translations = {
  ar: {
    reservationDate: "تاريخ الحجز",
    reservationTime: "وقت الحجز",
    timePlaceholder: "مثال: 16:00-18:00",
    paymentMethod: "طريقة الدفع",
    creditCard: "بطاقة ائتمانية",
    cash: "نقداً عند الحضور",
    couponCode: "كود الكوبون (اختياري)",
    couponPlaceholder: "أدخل الكود هنا إن وجد",
    submitButton: "تأكيد الحجز",
    submittingButton: "جاري التأكيد...",
    errorMessage: "عذراً، حدث خطأ ما. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
    dateRequired: "حقل التاريخ مطلوب.",
    timeRequired: "حقل الوقت مطلوب.",
    // ✅ تمت إضافة كل الرسائل هنا
    successReservationCreated: "تم إنشاء الحجز بنجاح.",
    unauthorized: "الرجاء تسجيل الدخول لإتمام الحجز.",
    networkError: "خطأ في الاتصال بالخادم.",
    errorBlocked: "أنت محظور حالياً من إجراء الحجوزات.",
    errorTimeSlotBooked: "عفواً، هذا الوقت محجوز بالفعل.",
    validationDateAfterToday: "يجب أن يكون تاريخ الحجز بعد اليوم.",
  },
  en: {
    reservationDate: "Reservation Date",
    reservationTime: "Reservation Time",
    timePlaceholder: "e.g., 16:00-18:00",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    cash: "Cash on Arrival",
    couponCode: "Coupon Code (Optional)",
    couponPlaceholder: "Enter code here if you have one",
    submitButton: "Confirm Booking",
    submittingButton: "Confirming...",
    errorMessage: "Sorry, an error occurred. Please check your data and try again.",
    dateRequired: "Date field is required.",
    timeRequired: "Time field is required.",
    // ✅ All messages are added here
    successReservationCreated: "Reservation created successfully.",
    unauthorized: "Please log in to complete the booking.",
    networkError: "Network connection error.",
    errorBlocked: "You are currently blocked from making reservations.",
    errorTimeSlotBooked: "Sorry, this time slot is already booked.",
    validationDateAfterToday: "The reservation date must be a date after today.",
  },
};

interface ReservePlaygroundFormProps {
  playGroundId: number;
  onClose: () => void;
}

const ReservePlaygroundForm: FC<ReservePlaygroundFormProps> = ({ playGroundId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token, isAuthenticated } = useAuth(); // استخدام isAuthenticated

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  
  const [formData, setFormData] = useState<Omit<ReservePlayGroundRequest, 'playGroundId'>>({
    reservationDate: '',
    reservationTime: '',
    paymentMethod: 'credit_card',
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
    if (!formData.reservationDate) newErrors.reservationDate = t('dateRequired');
    if (!formData.reservationTime.trim()) newErrors.reservationTime = t('timeRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =================================================================
  // ✅ الخطوة 2: تحديث دالة إرسال النموذج بمنطق الترجمة
  // =================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isAuthenticated) {
        toast.error(t('unauthorized'));
        return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const apiData = {
      play_ground_id: playGroundId,
      reservation_date: formData.reservationDate,
      reservation_time: formData.reservationTime,
      payment_method: formData.paymentMethod,
      coupon_code: formData.couponCode || undefined,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/playgrounds/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();
      
      const messagesMap: { [key: string]: keyof typeof translations['en'] } = {
          'Reservation created successfully.': 'successReservationCreated',
          'You are currently blocked from making reservations.': 'errorBlocked',
          'Sorry, this time slot is already booked.': 'errorTimeSlotBooked',
          'The reservation date must be a date after today.': 'validationDateAfterToday',
      };
      
      const apiMessage = result.message || '';
      const translationKey = messagesMap[apiMessage];
      const translatedMessage = translationKey ? t(translationKey) : apiMessage;

      if (response.ok) {
        toast.success(translatedMessage || t('successReservationCreated'));
        setTimeout(onClose, 2000);
      } else {
        console.error('API Error:', result);
        let finalErrorMessage = translatedMessage;

        if (!finalErrorMessage && result.errors) {
            const firstErrorKey = Object.keys(result.errors)[0];
            const firstErrorMessage = result.errors[firstErrorKey]?.[0];
            const errorTranslationKey = firstErrorMessage ? messagesMap[firstErrorMessage] : undefined;
            finalErrorMessage = errorTranslationKey ? t(errorTranslationKey) : firstErrorMessage || t('errorMessage');
        } else if (!finalErrorMessage) {
            finalErrorMessage = t('errorMessage');
        }
        
        toast.error(finalErrorMessage);

        if (result.errors) {
            const flatErrors: Record<string, string> = {};
            for (const key in result.errors) {
                if (result.errors[key].length > 0) {
                    flatErrors[key] = result.errors[key][0];
                }
            }
            setErrors(flatErrors);
        }
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(t('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500'
      : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'
  }`;
  
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="reservationDate" className={labelClasses}>{t('reservationDate')}</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" id="reservationDate" name="reservationDate" value={formData.reservationDate} onChange={handleChange} className={inputClasses} style={{ colorScheme: theme }} />
          </div>
          {errors.reservation_date && <p className="text-red-400 text-sm mt-1">{errors.reservation_date}</p>}
        </div>
        <div>
          <label htmlFor="reservationTime" className={labelClasses}>{t('reservationTime')}</label>
          <div className="relative">
            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" id="reservationTime" name="reservationTime" placeholder={t('timePlaceholder')} value={formData.reservationTime} onChange={handleChange} className={inputClasses} />
          </div>
          {errors.reservation_time && <p className="text-red-400 text-sm mt-1">{errors.reservation_time}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="paymentMethod" className={labelClasses}>{t('paymentMethod')}</label>
        <div className="relative">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClasses}>
            <option value="credit_card">{t('creditCard')}</option>
            <option value="cash">{t('cash')}</option>
            <option value="MTN_CASH">MTN Cash</option>
          </select>
        </div>
        {errors.payment_method && <p className="text-red-400 text-sm mt-1">{errors.payment_method}</p>}
      </div>

      <div>
        <label htmlFor="couponCode" className={`block font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('couponCode')}</label>
        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode ?? ''} onChange={handleChange} className={inputClasses} />
        </div>
        {errors.coupon_code && <p className="text-red-400 text-sm mt-1">{errors.coupon_code}</p>}
      </div>

      <hr className={`!my-8 ${theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200'}`} />

      <button type="submit" disabled={isSubmitting || !isAuthenticated} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
};

export default ReservePlaygroundForm;