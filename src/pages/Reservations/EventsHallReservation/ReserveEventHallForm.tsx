import React, { useState, useEffect, useCallback, FC } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaTicketAlt, FaBuilding, FaExclamationTriangle } from 'react-icons/fa'; // ✅ FaExclamationTriangle
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

const translations = {
  ar: {
    eventType: "نوع المناسبة", wedding: "حفل زفاف", funeral: "مناسبة عزاء",
    reservationDate: "تاريخ الحجز", reservationTime: "وقت الحجز", timePlaceholder: "مثال: 18:00-22:00",
    guests: "عدد الضيوف", paymentMethod: "طريقة الدفع", creditCard: "بطاقة ائتمانية",
    cash: "نقداً عند الحضور", couponCode: "كود الكوبون (اختياري)", couponPlaceholder: "أدخل الكود هنا إن وجد",
    submitButton: "تأكيد الحجز", submittingButton: "جاري التأكيد...",
    successMessage: "تم إرسال طلب الحجز بنجاح!",
    errorMessage: "عذراً، حدث خطأ ما. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
    networkError: "خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.",
    dateRequired: "حقل التاريخ مطلوب.", timeRequired: "حقل الوقت مطلوب.",
    guestsRequired: "يجب أن يكون عدد الضيوف شخصاً واحداً على الأقل.",
    unauthorized: "يجب تسجيل الدخول أولاً لإجراء الحجز.", // added unauthorized message for consistency
  },
  en: {
    title: "Event Hall Reservation", eventType: "Event Type", wedding: "Wedding", funeral: "Funeral",
    reservationDate: "Reservation Date", reservationTime: "Reservation Time", timePlaceholder: "e.g., 18:00-22:00",
    guests: "Number of Guests", paymentMethod: "Payment Method", creditCard: "Credit Card",
    cash: "Cash on Arrival", couponCode: "Coupon Code (Optional)", couponPlaceholder: "Enter code here if you have one",
    submitButton: "Confirm Booking", submittingButton: "Confirming...",
    successMessage: "Event Hall booking Send successfully!",
    errorMessage: "Sorry, an error occurred. Please check your data and try again.",
    networkError: "Server connection error. Please check your internet connection.",
    dateRequired: "Date field is required.", timeRequired: "Time field is required.",
    guestsRequired: "Number of guests must be at least 1.",
    unauthorized: "Please login first to make a reservation.",
  },
};

interface ReserveEventHallFormProps {
    eventHallId: number;
    onClose: () => void;
}

const ReserveEventHallForm: FC<ReserveEventHallFormProps> = ({ eventHallId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token } = useAuth();

  // استخدام الترجمة الإنجليزية للواجهة، والترجمة العربية لرسائل الـ toast
  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  const tArabic = useCallback((key: keyof typeof translations['ar']) => translations['ar'][key] || key, []); // للوصول لترجمات الـ toast العربية

  const [formData, setFormData] = useState<Omit<ReserveEventHallRequest, 'eventHallId'>>({
    eventType: 'wedding', reservationDate: '', reservationTime: '',
    guests: 1, paymentMethod: 'credit_card', couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // منع التمرير عند فتح الفورم
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // دالة لتحويل الأخطاء من صيغة API (snake_case) إلى صيغة state (camelCase)
  const mapApiErrors = (apiErrors: Record<string, string[]>): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    for (const key in apiErrors) {
      // تحويل أسماء الحقول من snake_case إلى camelCase
      const frontendKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (apiErrors[key].length > 0) {
        newErrors[frontendKey] = apiErrors[key][0]; // أخذ أول خطأ في القائمة
      }
    }
    return newErrors;
  };

  // دالة للتحقق من صحة المدخلات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.reservationDate) newErrors.reservationDate = t('dateRequired');
    // التأكد من أن الوقت ليس فارغًا بعد إزالة المسافات
    if (!formData.reservationTime || !formData.reservationTime.trim()) newErrors.reservationTime = t('timeRequired');
    if (!formData.guests || formData.guests < 1) newErrors.guests = t('guestsRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // إرجاع true إذا لم تكن هناك أخطاء
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // مسح الأخطاء القديمة

    // التحقق من تسجيل الدخول
    if (!token) {
      toast.error(t('unauthorized')); // رسالة عدم السماح باستخدام الترجمة الإنجليزية
      return;
    }
    
    // التحقق من صحة الفورم قبل الإرسال
    if (!validateForm()) {
      return;
    }
      
    setIsSubmitting(true); // تفعيل حالة الإرسال
    
    // بناء البيانات المرسلة إلى الـ API
    const payload = {
      event_hall_id: eventHallId,
      event_type: formData.eventType,
      reservation_date: formData.reservationDate,
      reservation_time: formData.reservationTime, // تأكد من أن هذه الصيغة مقبولة من الـ API
      guests: formData.guests,
      payment_method: formData.paymentMethod,
      ...(formData.couponCode && { coupon_code: formData.couponCode }), // إضافة الكوبون فقط إذا تم إدخاله
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/event-halls/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // إضافة الرمز (token) للمصادقة
        },
        body: JSON.stringify(payload),
      });

      const result: ApiErrorResponse = await response.json();

      if (response.ok) {
        // ✅ نجاح: عرض رسالة النجاح باللغة العربية إذا كانت اللغة هي العربية
        const successMessage = language === 'ar' 
          ? tArabic('successMessage') // استخدم الترجمة العربية الثابتة
          : result.message || t('successMessage'); // استخدم رسالة السيرفر أو الترجمة الإنجليزية

        toast.success(successMessage);
        setTimeout(onClose, 2500); // إغلاق النموذج بعد 2.5 ثانية
      } else {
        // ❌ خطأ من الخادم
        console.error('API Error:', result);
        let errorMessage = tArabic('errorMessage'); // رسالة خطأ افتراضية عربية
        if (result.errors) {
          // محاولة استخراج خطأ محدد من الـ backend
          const firstErrorKey = Object.keys(result.errors)[0];
          if (firstErrorKey && result.errors[firstErrorKey].length > 0) {
            errorMessage = result.errors[firstErrorKey][0]; // استخدام أول خطأ في القائمة
          }
        } else if (result.message) {
          errorMessage = result.message; // استخدام رسالة عامة من الـ backend
        }
        toast.error(errorMessage); // عرض الخطأ للمستخدم
        if (result.errors) {
          // تحديث حالة الأخطاء لعرضها بجانب الحقول
          setErrors(mapApiErrors(result.errors));
        }
      }
    } catch (error) {
      // ❌ خطأ في الشبكة أو خطأ غير متوقع
      toast.error(tArabic('networkError')); // استخدام رسالة خطأ الشبكة العربية
      console.error("Network or submission error:", error);
    } finally {
      setIsSubmitting(false); // إيقاف حالة الإرسال
    }
  };

  // دالة لمعالجة تغيير قيم الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // تحديث state مع تحويل قيمة الضيوف إلى رقم
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
    // إزالة رسالة الخطأ عند تعديل الحقل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Classes for styling inputs and labels based on theme
  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500' : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'}`;
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="eventType" className={labelClasses}>{t('eventType')}</label>
          <div className="relative">
            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                style={{ colorScheme: theme }} // للتوافق مع الثيم الداكن/الفاتح
              />
            </div>
            {errors.reservationDate && <p className="text-red-400 text-sm mt-1">{errors.reservationDate}</p>}
          </div>
          <div>
            <label htmlFor="reservationTime" className={labelClasses}>{t('reservationTime')}</label>
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" // استخدام text للسماح بالـ placeholder والتنسيق المخصص
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
              <option value="MTN_CASH">MTN Cash</option> {/* يمكن ترجمتها إذا لزم الأمر */}
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
          disabled={isSubmitting || !token} 
          className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('submittingButton') : t('submitButton')}
        </button>
    </form>
  );
};

export default ReserveEventHallForm;