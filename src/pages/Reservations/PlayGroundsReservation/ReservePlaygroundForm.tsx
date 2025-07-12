
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaCreditCard, FaTicketAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import type { ReservePlayGroundRequest } from '../../../types';

interface ReservePlaygroundFormProps {
  playGroundId: number;
  onClose: () => void;
}

const ReservePlaygroundForm: React.FC<ReservePlaygroundFormProps> = ({ playGroundId, onClose }) => {
  const [formData, setFormData] = useState<Omit<ReservePlayGroundRequest, 'playGroundId'>>({
    reservationDate: '',
    reservationTime: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('idle');
    if (validateForm()) {
      setIsSubmitting(true);
      const completeFormData: ReservePlayGroundRequest = { ...formData, playGroundId };
      try {
        console.log('Sending playground booking data:', completeFormData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmissionStatus('success');
        setSubmissionMessage('تم إرسال طلب حجز الملعب بنجاح!');
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="reservationDate" className="block text-orange-400 font-bold mb-2">تاريخ الحجز</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" id="reservationDate" name="reservationDate" value={formData.reservationDate} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" style={{ colorScheme: 'dark' }} />
          </div>
          {errors.reservationDate && <p className="text-red-400 text-sm mt-1">{errors.reservationDate}</p>}
        </div>
        <div>
          <label htmlFor="reservationTime" className="block text-orange-400 font-bold mb-2">وقت الحجز</label>
          <div className="relative">
            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" id="reservationTime" name="reservationTime" placeholder="مثال: 16:00-18:00" value={formData.reservationTime} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          </div>
          {errors.reservationTime && <p className="text-red-400 text-sm mt-1">{errors.reservationTime}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="paymentMethod" className="block text-orange-400 font-bold mb-2">طريقة الدفع</label>
        <div className="relative">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none">
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
          <input type="text" id="couponCode" name="couponCode" placeholder="أدخل الكود هنا إن وجد" value={formData.couponCode ?? ''} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
        </div>
      </div>

      <hr className="border-gray-700/60 !my-8" />

      {submissionStatus !== 'idle' && (
        <div className={`flex items-center justify-center gap-3 text-center p-3 rounded-lg font-semibold ${submissionStatus === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {submissionStatus === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{submissionMessage}</span>
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
      </button>
    </form>
  );
};

export default ReservePlaygroundForm;