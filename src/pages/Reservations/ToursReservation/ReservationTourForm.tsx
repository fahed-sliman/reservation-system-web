
import React, { useState, useCallback, FC } from 'react';
import { FaUsers, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext'; 

export interface ReserveTourRequestئ {
  tour_id: number;
  guests: number;
  payment_method: 'cash' | 'paypal' | 'credit_card';
  coupon_code?: string | null;
}

interface ReserveTourFormProps {
  tourId: number;
  onClose: () => void;
}

// =================================================================
// ✅  الخطوة 1: تحديث قاموس الترجمة
// =================================================================
const translations = {
  ar: {
    title: "حجز رحلة سياحية",
    travelers: "عدد المسافرين",
    paymentMethod: "طريقة الدفع",
    cash: "نقداً",
    paypal: "باي بال",
    creditCard: "بطاقة ائتمان",
    couponCode: "كود الخصم (اختياري)",
    couponPlaceholder: "أدخل الكود هنا",
    submitButton: "تأكيد الحجز",
    submittingButton: "جاري التأكيد...",
    errorMessage: "عذراً، حدث خطأ أثناء إرسال الحجز.",
    networkError: "خطأ في الاتصال بالشبكة.",
    guestsRequired: "يجب أن يكون عدد المسافرين شخصاً واحداً على الأقل.",
    loginRequired: "يجب تسجيل الدخول أولاً لإتمام الحجز.",
    // ✅ تمت إضافة كل الرسائل هنا
    successReservationCreated: "تم إنشاء الحجز بنجاح.",
    errorBlocked: "أنت محظور حالياً من إجراء الحجوزات.",
    errorTourFull: "عفواً، هذه الرحلة ممتلئة ولا يوجد أماكن شاغرة.",
  },
  en: {
    title: "Book a Tour",
    travelers: "Number of Travelers",
    paymentMethod: "Payment Method",
    cash: "Cash",
    paypal: "PayPal",
    creditCard: "Credit Card",
    couponCode: "Coupon Code (Optional)",
    couponPlaceholder: "Enter code here",
    submitButton: "Confirm Booking",
    submittingButton: "Confirming...",
    errorMessage: "Sorry, an error occurred while sending the booking.",
    networkError: "Network connection error.",
    guestsRequired: "Number of travelers must be at least 1.",
    loginRequired: "You must be logged in to make a reservation.",
    // ✅ All messages are added here
    successReservationCreated: "Reservation created successfully.",
    errorBlocked: "You are currently blocked from making reservations.",
    errorTourFull: "Sorry, this tour is fully booked.",
  },
};

const ReserveTourForm: FC<ReserveTourFormProps> = ({ tourId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token, isAuthenticated } = useAuth();

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  
  const [formData, setFormData] = useState({
    guests: 1,
    paymentMethod: 'cash' as 'cash' | 'paypal' | 'credit_card',
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};
    if (!formData.guests || formData.guests < 1) newErrors.guests = [t('guestsRequired')];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // =================================================================
  // ✅ الخطوة 2: تحديث دالة إرسال النموذج بمنطق الترجمة
  // =================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isAuthenticated || !token) {
        toast.error(t('loginRequired'));
        return;
    }

    setIsSubmitting(true);
    
    const apiPayload = { 
      tour_id: tourId,
      guests: formData.guests,
      payment_method: formData.paymentMethod,
      coupon_code: formData.couponCode || null,
    };
    
    const apiUrl = 'http://127.0.0.1:8000/api/tours/reserve';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload),
      });

      const result = await response.json();

      const messagesMap: { [key: string]: keyof typeof translations['en'] } = {
        'Reservation created successfully.': 'successReservationCreated',
        'You are currently blocked from making reservations.': 'errorBlocked',
        'Sorry, this tour is fully booked.': 'errorTourFull',
      };
      
      const apiMessage = result.message || '';
      const translationKey = messagesMap[apiMessage];
      const translatedMessage = translationKey ? t(translationKey) : apiMessage;

      if (response.ok) {
        toast.success(translatedMessage || t('successReservationCreated'));
        setTimeout(onClose, 2000);
      } else {
        let finalErrorMessage = translatedMessage;

        if (!finalErrorMessage && result.errors) {
            const firstErrorKey = Object.keys(result.errors)[0];
            finalErrorMessage = result.errors[firstErrorKey]?.[0] || t('errorMessage');
        } else if (!finalErrorMessage) {
            finalErrorMessage = t('errorMessage');
        }
        
        toast.error(finalErrorMessage);
        setErrors(result.errors || {});
      }
    } catch (error) {
      toast.error(t('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: undefined }));
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value as any }));
  };

  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500'
      : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'
  }`;
  
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h2>
      
      <div>
        <label htmlFor="guests" className={labelClasses}>{t('travelers')}</label>
        <div className="relative">
          <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} className={inputClasses} />
        </div>
        {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests[0]}</p>}
      </div>

      <div>
        <label htmlFor="paymentMethod" className={labelClasses}>{t('paymentMethod')}</label>
        <div className="relative">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClasses}>
            <option value="cash">{t('cash')}</option>
            <option value="paypal">{t('paypal')}</option>
            <option value="credit_card">{t('creditCard')}</option>
          </select>
        </div>
        {errors.payment_method && <p className="text-red-400 text-sm mt-1">{errors.payment_method[0]}</p>}
      </div>
      
      <div>
        <label htmlFor="couponCode" className={labelClasses}>{t('couponCode')}</label>
        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode ?? ''} onChange={handleChange} className={inputClasses} />
        </div>
        {errors.coupon_code && <p className="text-red-400 text-sm mt-1">{errors.coupon_code[0]}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
};

export default ReserveTourForm;