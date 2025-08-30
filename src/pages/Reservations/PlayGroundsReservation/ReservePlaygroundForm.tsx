import React, { useState, useEffect, useCallback, FC } from 'react';
import { FaCalendarAlt, FaClock, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast'; // ✅ 1. Import toast for notifications
import type { ReservePlayGroundRequest } from '../../../types';

// Contexts
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext'; // ✅ 2. Import useAuth to get the token

interface ReservePlaygroundFormProps {
  playGroundId: number;
  onClose: () => void;
}

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
    successMessage: "تم إرسال طلب حجز الملعب بنجاح!",
    errorMessage: "عذراً، حدث خطأ ما. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
    dateRequired: "حقل التاريخ مطلوب.",
    timeRequired: "حقل الوقت مطلوب.",
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
    successMessage: "Playground booking request sent successfully!",
    errorMessage: "Sorry, an error occurred. Please check your data and try again.",
    dateRequired: "Date field is required.",
    timeRequired: "Time field is required.",
  },
};

const ReservePlaygroundForm: FC<ReservePlaygroundFormProps> = ({ playGroundId, onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { token } = useAuth(); // ✅ 3. Get the authentication token from the context

  const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);
  
  const [formData, setFormData] = useState<Omit<ReservePlayGroundRequest, 'playGroundId'>>({
    reservationDate: '',
    reservationTime: '',
    paymentMethod: 'credit_card',
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ❌ The 'submissionStatus' and 'submissionMessage' states are no longer needed.
  // We will use react-hot-toast instead.

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

  // ✅ 4. Updated handleSubmit function to call the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Prepare the data with snake_case keys for the Laravel API
    const apiData = {
      play_ground_id: playGroundId,
      reservation_date: formData.reservationDate,
      reservation_time: formData.reservationTime,
      payment_method: formData.paymentMethod,
      coupon_code: formData.couponCode || undefined, // Send undefined if empty
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/playgrounds/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        // If the API returns an error (e.g., 422 Validation Error)
        const errorMessage = result.message || t('errorMessage');
        toast.error(errorMessage);
        if (result.errors) {
          // Optional: Display specific validation errors from the backend
          setErrors(result.errors);
        }
        return; // Stop execution on error
      }
      
      // On success
      toast.success(t('successMessage'));
      setTimeout(onClose, 2000); // Close the form after 2 seconds

    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(t('errorMessage')); // Show a generic error for network issues etc.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for a field when the user starts typing in it
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
          {errors.reservationDate && <p className="text-red-400 text-sm mt-1">{errors.reservationDate}</p>}
        </div>
        <div>
          <label htmlFor="reservationTime" className={labelClasses}>{t('reservationTime')}</label>
          <div className="relative">
            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" id="reservationTime" name="reservationTime" placeholder={t('timePlaceholder')} value={formData.reservationTime} onChange={handleChange} className={inputClasses} />
          </div>
          {errors.reservationTime && <p className="text-red-400 text-sm mt-1">{errors.reservationTime}</p>}
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
        {errors.paymentMethod && <p className="text-red-400 text-sm mt-1">{errors.paymentMethod}</p>}
      </div>

      <div>
        <label htmlFor="couponCode" className={`block font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('couponCode')}</label>
        <div className="relative">
          <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="couponCode" name="couponCode" placeholder={t('couponPlaceholder')} value={formData.couponCode ?? ''} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <hr className={`!my-8 ${theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200'}`} />

      {/* ❌ The success/error message div has been removed. Toasts will be used instead. */}

      <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
};

export default ReservePlaygroundForm;