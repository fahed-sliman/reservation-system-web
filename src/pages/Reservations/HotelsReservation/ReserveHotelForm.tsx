import React, { useState, useEffect, useCallback, FC } from 'react';
import { FaCalendarAlt, FaMoon, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import type { ReserveHotelRequest } from '../../../types'; 
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext'; 
import toast from 'react-hot-toast';

// =================================================================
// ✅  الخطوة 1: تحديث قاموس الترجمة
// =================================================================
const translations = {
  ar: {
    arrivalDate: "تاريخ الوصول",
    nightsCount: "عدد الليالي",
    paymentMethod: "طريقة الدفع",
    creditCard: "بطاقة ائتمانية",
    paypal: "باي بال",
    cashOnArrival: "نقداً عند الوصول",
    couponCode: "كود الكوبون (اختياري)",
    couponPlaceholder: "أدخل الكود هنا إن وجد",
    submitButton: "تأكيد الحجز",
    submittingButton: "جاري التأكيد...",
    successMessage: "تم إرسال طلب حجز الغرفة بنجاح!",
    errorMessage: "عذراً، حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.",
    unauthorizedError: "الرجاء تسجيل الدخول لإتمام الحجز.",
    startDateRequired: "تاريخ بدء الحجز مطلوب.",
    nightsRequired: "يجب حجز ليلة واحدة على الأقل.",
    startDatePast: "تاريخ الوصول يجب أن يكون اليوم أو في المستقبل.",
    errorBlocked: "أنت محظور حالياً من إجراء الحجوزات.",
    // رسالة الخطأ الجديدة
    errorRoomReserved: "هذه الغرفة محجوزة بالفعل خلال الفترة المحددة.",
  },
  en: {
    arrivalDate: "Arrival Date",
    nightsCount: "Number of Nights",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    paypal: "PayPal",
    cashOnArrival: "Cash on Arrival",
    couponCode: "Coupon Code (Optional)",
    couponPlaceholder: "Enter code here if you have one",
    submitButton: "Confirm Booking",
    submittingButton: "Confirming...",
    successMessage: "Room booking request sent successfully!",
    errorMessage: "Sorry, an error occurred while sending the booking. Please try again.",
    unauthorizedError: "Please log in to complete the booking.",
    startDateRequired: "Start date is required.",
    nightsRequired: "You must book at least one night.",
    startDatePast: "Arrival date must be today or in the future.",
    errorBlocked: "You are currently blocked from making reservations.",
    // New error message
    errorRoomReserved: "This room is already reserved during the selected period.",
  },
};

// واجهة الـ Props يجب تعريفها
interface ReserveHotelFormProps {
  hotelId: number;
  roomNumber: number;
  onClose: () => void;
}

const ReserveHotelForm: FC<ReserveHotelFormProps> = ({ hotelId, roomNumber, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token, isAuthenticated } = useAuth(); 

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

  const [formData, setFormData] = useState<{
    startDate: string;
    nights: number;
    paymentMethod: 'credit_card' | 'paypal' | 'cash';
    couponCode: string;
  }>({
    startDate: '',
    nights: 1,
    paymentMethod: 'credit_card',
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = getTodayDate();
    if (!formData.startDate) {
      setFormData(prev => ({ ...prev, startDate: today }));
    }
  }, [formData.startDate]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = getTodayDate();

    if (!formData.startDate) {
      newErrors.startDate = t('startDateRequired');
    } else if (new Date(formData.startDate) < new Date(today)) {
      newErrors.startDate = t('startDatePast');
    }

    if (!formData.nights || formData.nights < 1) {
      newErrors.nights = t('nightsRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =================================================================
  // ✅ الخطوة 2: تحديث دالة إرسال النموذج
  // =================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error(t('unauthorizedError'));
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      
      const completeFormData: ReserveHotelRequest = {
        hotel_id: hotelId,
        room_number: roomNumber,
        start_date: formData.startDate,
        nights: formData.nights,
        payment_method: formData.paymentMethod,
        ...(formData.couponCode && { coupon_code: formData.couponCode }), 
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/api/hotels/reserve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(completeFormData),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(t('successMessage'));
          setTimeout(onClose, 2000);
        } else {
          // --- منطق معالجة الخطأ المترجم ---
          console.error('API Error:', result);
          const apiErrorMessage = result.message || '';

          // قاموس لربط رسائل الخادم بمفاتيح الترجمة
          const errorMessagesMap: { [key: string]: keyof typeof translations['en'] } = {
            'You are currently blocked from making reservations.': 'errorBlocked',
            'This room is already reserved during the selected period.': 'errorRoomReserved', // ✅ تمت الإضافة هنا
          };

          const translationKey = errorMessagesMap[apiErrorMessage];
          let finalErrorMessage = t('errorMessage');

          if (translationKey) {
            finalErrorMessage = t(translationKey);
          } else if (apiErrorMessage) {
            finalErrorMessage = apiErrorMessage;
          } else if (result.errors) {
            const firstErrorKey = Object.keys(result.errors)[0];
            if (firstErrorKey && result.errors[firstErrorKey].length > 0) {
              finalErrorMessage = result.errors[firstErrorKey][0];
            }
          }
          
          toast.error(finalErrorMessage);
        }
      } catch (error) {
        console.error('Network or unexpected error:', error);
        toast.error(t('errorMessage'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'nights' ? Number(value) : value }));
  };

  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500' : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'}`;
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className={labelClasses}>{t('arrivalDate')}</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              id="startDate" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              className={inputClasses} 
              style={{ colorScheme: theme }}
              min={getTodayDate()}
            />
          </div>
          {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="nights" className={labelClasses}>{t('nightsCount')}</label>
          <div className="relative">
            <FaMoon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" id="nights" name="nights" min="1" value={formData.nights} onChange={handleChange} className={inputClasses} />
          </div>
          {errors.nights && <p className="text-red-400 text-sm mt-1">{errors.nights}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="paymentMethod" className={labelClasses}>{t('paymentMethod')}</label>
        <div className="relative">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClasses}>
            <option value="credit_card">{t('creditCard')}</option>
            <option value="paypal">{t('paypal')}</option>
            <option value="cash">{t('cashOnArrival')}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="couponCode" className={`block font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('couponCode')}</label>
        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <hr className={`!my-8 ${theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200'}`} />
      
      <button type="submit" disabled={isSubmitting || !isAuthenticated} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
      {!isAuthenticated && (
        <p className="text-red-400 text-sm text-center mt-2">{t('unauthorizedError')}</p>
      )}
    </form>
  );
};

export default ReserveHotelForm;