import React, { useState, useCallback, FC } from 'react';
import { FaUsers, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext'; 

// الواجهة التي قدمتها للطلب
export interface ReserveTourRequest {
  tour_id: number;
  guests: number;
  payment_method: 'cash' | 'paypal' | 'credit_card'; // ✅ تم التعديل هنا أيضاً
  coupon_code?: string | null; // ✅ تم التعديل هنا أيضاً
}

interface ReserveTourFormProps {
  tourId: number;
  onClose: () => void;
}

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
    successMessage: " إرسال طلب حجز الرحلة بنجاح!",
    errorMessage: "عذراً، حدث خطأ أثناء إرسال الحجز.",
    guestsRequired: "يجب أن يكون عدد المسافرين شخصاً واحداً على الأقل.",
    loginRequired: "يجب تسجيل الدخول أولاً لإتمام الحجز.",
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
    successMessage: "Tour booking request sent successfully!",
    errorMessage: "Sorry, an error occurred while sending the booking.",
    guestsRequired: "Number of travelers must be at least 1.",
    loginRequired: "You must be logged in to make a reservation.",
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.guests || formData.guests < 1) newErrors.guests = t('guestsRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isAuthenticated || !token) {
        toast.error(t('loginRequired'));
        return;
    }

    setIsSubmitting(true);
    
    // بناء الحمولة (Payload) التي سترسل إلى الـ API
    const apiPayload = { 
      tour_id: tourId,
      guests: formData.guests,
      payment_method: formData.paymentMethod, // ✅ التعديل الرئيسي هنا: من paymentMethod إلى payment_method
      coupon_code: formData.couponCode || null, // ✅ التعديل الرئيسي هنا: من couponCode إلى coupon_code
    };
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/tours/reserve`;

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

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || t('errorMessage'));
        setErrors(data.errors || {});
        return;
      }
      
      toast.success(t('successMessage'));
      setTimeout(onClose, 2000);

    } catch (error) {
      toast.error(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: undefined })); // مسح الخطأ عند التغيير
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value as any }));
  };

  // ... باقي الكود يبقى كما هو ...
  const inputClasses = `w-full text-lg pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-300 ${
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-600 focus:ring-orange-500'
      : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-orange-500'
  }`;
  
  const labelClasses = `block font-bold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h2>
      
      {/* حقل عدد الضيوف (المسافرين) */}
      <div>
        <label htmlFor="guests" className={labelClasses}>{t('travelers')}</label>
        <div className="relative">
          <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} className={inputClasses} />
        </div>
        {/* @ts-ignore */}
        {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests[0]}</p>}
      </div>

      {/* حقل طريقة الدفع */}
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
        {/* @ts-ignore */}
        {errors.payment_method && <p className="text-red-400 text-sm mt-1">{errors.payment_method[0]}</p>}
      </div>
      
      {/* حقل كود الخصم */}
      <div>
        <label htmlFor="couponCode" className={labelClasses}>{t('couponCode')}</label>

        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode ?? ''} onChange={handleChange} className={inputClasses} />
        </div>
        {/* @ts-ignore */}
        {errors.coupon_code && <p className="text-red-400 text-sm mt-1">{errors.coupon_code[0]}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
};

export default ReserveTourForm;