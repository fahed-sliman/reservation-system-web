import React, { useState, useEffect, useCallback, type FC } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaTicketAlt, FaBuilding } from 'react-icons/fa';
import type { ReserveEventHallRequest } from '../../../types';

// Import necessary contexts
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

// Interface for the error response from the server
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// =================================================================
// ✅  الخطوة 1: تحديث قاموس الترجمة
// =================================================================
const translations = {
  ar: {
    eventType: "نوع المناسبة", wedding: "حفل زفاف", funeral: "مناسبة عزاء",
    reservationDate: "تاريخ الحجز", reservationTime: "وقت الحجز", timePlaceholder: "مثال: 18:00-22:00",
    guests: "عدد الضيوف", paymentMethod: "طريقة الدفع", creditCard: "بطاقة ائتمانية",
    cash: "نقداً عند الحضور", couponCode: "كود الكوبون (اختياري)", couponPlaceholder: "أدخل الكود هنا إن وجد",
    submitButton: "تأكيد الحجز", submittingButton: "جاري التأكيد...",
    errorMessage: "عذراً، حدث خطأ ما. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
    networkError: "خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.",
    dateRequired: "حقل التاريخ مطلوب.", timeRequired: "حقل الوقت مطلوب.",
    guestsRequired: "يجب أن يكون عدد الضيوف شخصاً واحداً على الأقل.",
    unauthorized: "يجب تسجيل الدخول أولاً لإجراء الحجز.",
    // ✅ تمت إضافة كل الرسائل هنا
    successReservationCreated: "تم إنشاء الحجز بنجاح.",
    errorBlocked: "أنت محظور حالياً من إجراء الحجوزات.",
    errorHallReserved: "القاعة محجوزة بالفعل خلال التاريخ والوقت المحددين.",
    validationGuestsRequired: "حقل عدد الضيوف مطلوب.",
    validationDateRequired: "حقل تاريخ الحجز مطلوب.",
    validationTimeRequired: "حقل وقت الحجز مطلوب.",
    validationDateAfterToday: "يجب أن يكون تاريخ الحجز بعد اليوم.",
  },
  en: {
    eventType: "Event Type", wedding: "Wedding", funeral: "Funeral",
    reservationDate: "Reservation Date", reservationTime: "Reservation Time", timePlaceholder: "e.g., 18:00-22:00",
    guests: "Number of Guests", paymentMethod: "Payment Method", creditCard: "Credit Card",
    cash: "Cash on Arrival", couponCode: "Coupon Code (Optional)", couponPlaceholder: "Enter code here if you have one",
    submitButton: "Confirm Booking", submittingButton: "Confirming...",
    errorMessage: "Sorry, an error occurred. Please check your data and try again.",
    networkError: "Server connection error. Please check your internet connection.",
    dateRequired: "Date field is required.", timeRequired: "Time field is required.",
    guestsRequired: "Number of guests must be at least 1.",
    unauthorized: "Please login first to make a reservation.",
    // ✅ All messages are added here
    successReservationCreated: "Reservation created successfully.",
    errorBlocked: "You are currently blocked from making reservations.",
    errorHallReserved: "The event hall is already reserved during the selected date and time.",
    validationGuestsRequired: "The guests field is required.",
    validationDateRequired: "The reservation date field is required.",
    validationTimeRequired: "The reservation time field is required.",
    validationDateAfterToday: "The reservation date must be a date after today.",
  },
};

interface ReserveEventHallFormProps {
    eventHallId: number;
    onClose: () => void;
}

const ReserveEventHallForm: FC<ReserveEventHallFormProps> = ({ eventHallId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token, isAuthenticated } = useAuth();

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

  const [formData, setFormData] = useState<Omit<ReserveEventHallRequest, 'eventHallId'>>({
    eventType: 'wedding', reservationDate: '', reservationTime: '',
    guests: 1, paymentMethod: 'credit_card', couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const mapApiErrors = (apiErrors: Record<string, string[]>): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    for (const key in apiErrors) {
      const frontendKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (apiErrors[key].length > 0) {
        newErrors[frontendKey] = apiErrors[key][0];
      }
    }
    return newErrors;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.reservationDate) newErrors.reservationDate = t('dateRequired');
    if (!formData.reservationTime || !formData.reservationTime.trim()) newErrors.reservationTime = t('timeRequired');
    if (!formData.guests || formData.guests < 1) newErrors.guests = t('guestsRequired');
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
    
    const payload = {
      event_hall_id: eventHallId,
      event_type: formData.eventType,
      reservation_date: formData.reservationDate,
      reservation_time: formData.reservationTime,
      guests: formData.guests,
      payment_method: formData.paymentMethod,
      ...(formData.couponCode && { coupon_code: formData.couponCode }),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/event-halls/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result: ApiErrorResponse = await response.json();

      // قاموس لربط رسائل الخادم بمفاتيح الترجمة (للنجاح والفشل)
      const messagesMap: { [key: string]: keyof typeof translations['en'] } = {
        'Reservation created successfully.': 'successReservationCreated',
        'You are currently blocked from making reservations.': 'errorBlocked',
        'The event hall is already reserved during the selected date and time.': 'errorHallReserved',
        'The guests field is required.': 'validationGuestsRequired',
        'The reservation date field is required.': 'validationDateRequired',
        'The reservation time field is required.': 'validationTimeRequired',
        'The reservation date must be a date after today.': 'validationDateAfterToday',
      };
      
      const apiMessage = result.message || '';
      const translationKey = messagesMap[apiMessage];
      const translatedMessage = translationKey ? t(translationKey) : apiMessage;

      if (response.ok) {
        toast.success(translatedMessage || t('successReservationCreated')); // رسالة افتراضية
        setTimeout(onClose, 2500);
      } else {
        console.error('API Error:', result);
        let finalErrorMessage = translatedMessage; // استخدم الرسالة المترجمة إن وجدت

        // إذا لم تكن هناك رسالة عامة، تحقق من أخطاء الحقول
        if (!finalErrorMessage && result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          const firstErrorMessage = result.errors[firstErrorKey]?.[0];
          const errorTranslationKey = firstErrorMessage ? messagesMap[firstErrorMessage] : undefined;
          finalErrorMessage = errorTranslationKey ? t(errorTranslationKey) : firstErrorMessage || t('errorMessage');
        } else if (!finalErrorMessage) {
            finalErrorMessage = t('errorMessage'); // رسالة افتراضية أخيرة
        }

        toast.error(finalErrorMessage);

        if (result.errors) {
          setErrors(mapApiErrors(result.errors));
        }
      }
    } catch (error) {
      toast.error(t('networkError'));
      console.error("Network or submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500' : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'}`;
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="eventType" className={labelClasses}>{t('eventType')}</label>
          <div className="relative">
            <FaBuilding className="absolute left-4 top-12 -translate-y-1/2 text-gray-400" />
            <select 
              id="eventType" 
              name="eventType" 
              value={formData.eventType} 
              onChange={handleChange} 
              className={inputClasses}
            >
              <option value="wedding">{t('wedding')}</option>
              <option value="funeral">{t('funeral')}</option>
            </select>
          </div>
          {errors.eventType && <p className="text-red-400 text-sm mt-1">{errors.eventType}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="reservationDate" className={labelClasses}>{t('reservationDate')}</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                id="reservationDate" 
                name="reservationDate" 
                value={formData.reservationDate} 
                onChange={handleChange} 
                className={`${inputClasses} ${errors.reservationDate ? 'border-red-500' : ''}`}
                style={{ colorScheme: theme }}
              />
            </div>
            {errors.reservationDate && <p className="text-red-400 text-sm mt-1">{errors.reservationDate}</p>}
          </div>
          <div>
            <label htmlFor="reservationTime" className={labelClasses}>{t('reservationTime')}</label>
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                id="reservationTime" 
                name="reservationTime" 
                placeholder={t('timePlaceholder')} 
                value={formData.reservationTime} 
                onChange={handleChange} 
                className={`${inputClasses} ${errors.reservationTime ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.reservationTime && <p className="text-red-400 text-sm mt-1">{errors.reservationTime}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="guests" className={labelClasses}>{t('guests')}</label>
          <div className="relative">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="number" 
              id="guests" 
              name="guests" 
              min="1" 
              value={formData.guests} 
              onChange={handleChange} 
              className={`${inputClasses} ${errors.guests ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests}</p>}
        </div>
        <div>
          <label htmlFor="paymentMethod" className={labelClasses}>{t('paymentMethod')}</label>
          <div className="relative">
            <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              id="paymentMethod" 
              name="paymentMethod" 
              value={formData.paymentMethod} 
              onChange={handleChange} 
              className={inputClasses}
            >
              <option value="credit_card">{t('creditCard')}</option>
              <option value="cash">{t('cash')}</option>
              <option value="MTN_CASH">MTN Cash</option>
            </select>
          </div>
          {errors.paymentMethod && <p className="text-red-400 text-sm mt-1">{errors.paymentMethod}</p>}
        </div>
        <div>
          <label htmlFor="couponCode" className={`block font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('couponCode')}
          </label>
          <div className="relative">
            <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              id="couponCode" 
              name="couponCode" 
              placeholder={t('couponPlaceholder')} 
              value={formData.couponCode ?? ''} 
              onChange={handleChange} 
              className={inputClasses} 
            />
          </div>
          {errors.couponCode && <p className="text-red-400 text-sm mt-1">{errors.couponCode}</p>}
        </div>
        <hr className={`!my-8 ${theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200'}`} />
        
        <button 
          type="submit" 
          disabled={isSubmitting || !isAuthenticated} 
          className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('submittingButton') : t('submitButton')}
        </button>
    </form>
  );
};

export default ReserveEventHallForm;