// src/components/ReserveEventHallForm.tsx

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaTicketAlt, FaBuilding, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import type { ReserveEventHallRequest } from '../../../types';

interface ReserveEventHallFormProps {
  eventHallId: number;
  onClose: () => void;
}

const ReserveEventHallForm: React.FC<ReserveEventHallFormProps> = ({ eventHallId, onClose }) => {
  const [formData, setFormData] = useState<Omit<ReserveEventHallRequest, 'eventHallId'>>({
    eventType: 'wedding',
    reservationDate: '',
    reservationTime: '',
    guests: 1,
    paymentMethod: 'credit_card',
    couponCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // قفل التمرير
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.reservationDate) newErrors.reservationDate = 'حقل التاريخ مطلوب.';
    if (!formData.reservationTime.trim()) newErrors.reservationTime = 'حقل الوقت مطلوب.';
    if (!formData.guests || formData.guests < 1) newErrors.guests = 'يجب أن يكون عدد الضيوف شخصاً واحداً على الأقل.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('idle');
    if (validateForm()) {
      setIsSubmitting(true);
      const completeFormData: ReserveEventHallRequest = { ...formData, eventHallId };
      try {
        console.log('Sending booking data:', completeFormData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmissionStatus('success');
        setSubmissionMessage('تم إرسال طلب الحجز بنجاح! سيتم إغلاق النموذج الآن.');
        setTimeout(onClose, 2000);
      } catch (error) {
        setSubmissionStatus('error');
        setSubmissionMessage('عذراً، حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="eventType" className="block text-orange-400 font-bold mb-2">نوع المناسبة</label>
          <div className="relative">
             <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300">
              <option value="wedding">حفل زفاف</option>
              <option value="funeral">مناسبة عزاء</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="reservationDate" className="block text-orange-400 font-bold mb-2">تاريخ الحجز</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" id="reservationDate" name="reservationDate" value={formData.reservationDate} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300" style={{colorScheme: 'dark'}} />
            </div>
            {errors.reservationDate && <p className="text-red-400 text-sm mt-1">{errors.reservationDate}</p>}
          </div>
          <div>
            <label htmlFor="reservationTime" className="block text-orange-400 font-bold mb-2">وقت الحجز</label>
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" id="reservationTime" name="reservationTime" placeholder="مثال: 18:00-22:00" value={formData.reservationTime} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300" />
            </div>
            {errors.reservationTime && <p className="text-red-400 text-sm mt-1">{errors.reservationTime}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-orange-400 font-bold mb-2">عدد الضيوف</label>
          <div className="relative">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300" />
          </div>
          {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests}</p>}
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block text-orange-400 font-bold mb-2">طريقة الدفع</label>
          <div className="relative">
            <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300">
              <option value="credit_card">بطاقة ائتمانية</option>
              <option value="cash">نقداً عند الحضور</option>
              <option value="MTN_CASH">MTN Cash</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="couponCode" className="block text-gray-400 font-bold mb-2">كود الكوبون (اختياري)</label>
          <div className="relative">
            <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" id="couponCode" name="couponCode" placeholder="أدخل الكود هنا إن وجد" value={formData.couponCode ?? ''} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-300" />
          </div>
        </div>
        
        <hr className="border-gray-700/60 !my-8" />
        
        {submissionStatus !== 'idle' && (
          <div className={`flex items-center justify-center gap-3 text-center p-3 rounded-lg font-semibold ${submissionStatus === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {submissionStatus === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{submissionMessage}</span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
          {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
        </button>
    </form>
  );
};

export default ReserveEventHallForm;