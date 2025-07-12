// src/components/ReserveTourForm.tsx

import React, { useState, useEffect } from 'react';
import { FaUsers, FaCreditCard, FaTicketAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import type { ReserveTourRequest } from '../../../types/tours';


interface ReserveTourFormProps {
  tourId: number;
  onClose: () => void;
}

const ReserveTourForm: React.FC<ReserveTourFormProps> = ({ tourId, onClose }) => {
  const [formData, setFormData] = useState<Omit<ReserveTourRequest, 'tourId'>>({
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
    if (!formData.guests || formData.guests < 1) newErrors.guests = 'يجب تحديد شخص واحد على الأقل.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const completeFormData: ReserveTourRequest = { ...formData, tourId };
      try {
        console.log('Sending tour booking data:', completeFormData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmissionStatus('success');
        setSubmissionMessage('تم إرسال طلب حجز الرحلة بنجاح!');
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
        <label htmlFor="guests" className="block text-orange-400 font-bold mb-2">عدد الأشخاص</label>
        <div className="relative">
          <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
        </div>
        {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests}</p>}
      </div>

      <div>
        <label htmlFor="paymentMethod" className="block text-orange-400 font-bold mb-2">طريقة الدفع</label>
        <div className="relative">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none">
            <option value="credit_card">بطاقة ائتمانية</option>
            <option value="paypal">PayPal</option>
            <option value="cash">نقداً عند الانطلاق</option>
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

      <button type="submit" disabled={isSubmitting} className= " cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed">
        {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الانضمام للرحلة'}
      </button>
    </form>
  );
};

export default ReserveTourForm;