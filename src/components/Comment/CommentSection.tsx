import React from 'react';
import { useEffect, useState, useCallback, FC } from 'react';
import toast from 'react-hot-toast';
import type { RateableType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';



const translations = {
  en: {
    ratingsCount: (options: { count: number }) => `Ratings (${options.count})`,
    addYourRatingAs: (options: { name?: string }) => `Add your rating, ${options.name || ''}!`,
    howWasExperiencePlaceholder: 'How was your experience? (optional)',
    submitRating: 'Submit Rating',
    loadingComments: 'Loading comments...',
    noRatingsYet: 'No ratings yet. Be the first to add one!',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete?',
    yesDelete: 'Yes, delete',
    sendingRating: 'Submitting your rating...',
    ratingAddedSuccess: 'Your rating has been added successfully!',
    failedToSendRating: 'Failed to submit rating',
    loginToComment: 'You must be logged in to comment',
    failedToLoadRatingsData: 'Failed to load ratings data',
    failedToLoadComments: 'Failed to load comments.',
    deletingRating: 'Deleting rating...',
    failedToDeleteRating: 'Failed to delete rating',
    ratingDeletedSuccess: 'Rating deleted successfully.',
    updatingRating: 'Updating rating...',
    failedToUpdateRating: 'Failed to update rating',
    ratingUpdatedSuccess: 'Your rating has been updated successfully.',
  },
  ar: {
    ratingsCount: (options: { count: number }) => `التقييمات (${options.count})`,
    addYourRatingAs: (options: { name?: string }) => `أضف تقييمك، ${options.name || ''}!`,
    howWasExperiencePlaceholder: 'كيف كانت تجربتك؟ (اختياري)',
    submitRating: 'إرسال التقييم',
    loadingComments: 'جارٍ تحميل التعليقات...',
    noRatingsYet: 'لا توجد تقييمات حتى الآن. كن أول من يضيف تقييمًا!',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    yesDelete: 'نعم, احذف',
    sendingRating: 'جارٍ إرسال تقييمك...',
    ratingAddedSuccess: 'تم إضافة تقييمك بنجاح!',
    failedToSendRating: 'فشل إرسال التقييم',
    loginToComment: 'يجب تسجيل الدخول للتعليق',
    failedToLoadRatingsData: 'فشل في تحميل بيانات التقييمات',
    failedToLoadComments: 'فشل في تحميل التعليقات.',
    deletingRating: 'جارٍ حذف التقييم...',
    failedToDeleteRating: 'فشل حذف التقييم',
    ratingDeletedSuccess: 'تم حذف التقييم بنجاح.',
    updatingRating: 'جارٍ تحديث التقييم...',
    failedToUpdateRating: 'فشل تحديث التقييم',
    ratingUpdatedSuccess: 'تم تعديل تقييمك بنجاح.',
  },
};

interface Comment {
  user_id: number;
  user_name: string;
  rating: number;
  comment: string | null; // من الأفضل تعديل النوع هنا ليعكس الواقع
  created_at: string;
}

interface CommentsSectionProps {
  type: RateableType;
  itemId: number;
}

const StarRatingInput: FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
  <div className="flex flex-row-reverse justify-end items-center" dir="ltr">
    {[5, 4, 3, 2, 1].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="text-3xl text-gray-400 transition-colors duration-200 ease-in-out hover:text-yellow-400 focus:outline-none cursor-pointer"
        style={{ color: star <= rating ? '#FBBF24' : '' }}
      >
        ★
      </button>
    ))}
  </div>
);

const CommentsSection: FC<CommentsSectionProps> = ({ type, itemId }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user, token, isAuthenticated } = useAuth();
  
  const t = useCallback((key: keyof typeof translations['en'], options?: { count?: number; name?: string }) => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return (translation as (options: never) => string)(options as never);
    }
    return translation;
  }, [language]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [editedRating, setEditedRating] = useState(5);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/api/rating/rates?type=${type}&id=${itemId}`);
      if (!res.ok) throw new Error(t("failedToLoadRatingsData"));
      const data = await res.json();
      setComments(data.latest_comments || []);
      setAverageRating(data.average_rating || 0);
    } catch (err) {
      toast.error(t("failedToLoadComments"));
    } finally {
      setLoading(false);
    }
  }, [type, itemId, t]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error(t('loginToComment'));
    const loadingToast = toast.loading(t('sendingRating'));
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rating/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: JSON.stringify({ type, id: itemId, rating: newRating, comment: newComment }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("failedToSendRating"));
      }
      toast.success(t('ratingAddedSuccess'), { id: loadingToast });
      fetchComments();
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      toast.error((err as Error).message, { id: loadingToast });
    }
  };

  const handleDelete = () => {
    if (!token) return;
    toast(
      (tInstance) => (
        <div className="flex flex-col items-center gap-4 p-2 text-white">
          <p className="font-bold">{t('confirmDelete')}</p>
          <div className="flex w-full gap-2">
            <button onClick={() => { _performDelete(); toast.dismiss(tInstance.id); }} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer">
              {t('yesDelete')}
            </button>
            <button onClick={() => toast.dismiss(tInstance.id)} className="flex-1 px-4 py-2 text-sm font-semibold bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer">
              {t('cancel')}
            </button>
          </div>
        </div>
      ),
      { duration: 6000, style: { background: '#4b5563', border: '1px solid #6b7280' } }
    );
  };

  const _performDelete = async () => {
    if (!token) return;
    const loadingToast = toast.loading(t('deletingRating'));
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rating/delete?type=${type}&id=${itemId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(t('failedToDeleteRating'));
      toast.success(t('ratingDeletedSuccess'), { id: loadingToast });
      fetchComments();
    } catch (err) {
      toast.error((err as Error).message, { id: loadingToast });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const loadingToast = toast.loading(t('updatingRating'));
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rating/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: JSON.stringify({ type, id: itemId, rating: editedRating, comment: editedCommentText }),
      });
      if (!res.ok) throw new Error(t("failedToUpdateRating"));
      toast.success(t('ratingUpdatedSuccess'), { id: loadingToast });
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      toast.error((err as Error).message, { id: loadingToast });
    }
  };

  // ✅ ==================  الحل هنا ================== ✅
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.user_id);
    setEditedRating(comment.rating);
    // إذا كان التعليق null، استخدم سلسلة فارغة '' بدلاً منه
    setEditedCommentText(comment.comment || '');
  };
  // ✅ =============================================== ✅
  
  const userHasCommented = comments.some(c => c.user_id === user?.id);

  return (
    <section className={`mt-12 p-6 md:p-8 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h3 className={`text-3xl font-bold mb-2 md:mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('ratingsCount', { count: comments.length })}</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
          <span className="text-yellow-400 text-2xl">★</span>
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{averageRating.toFixed(1)}</span>
          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/ 5.0</span>
        </div>
      </div>

      {isAuthenticated && !userHasCommented && (
        <form onSubmit={handleSubmit} className={`mb-10 p-5 rounded-lg space-y-4 border ${theme === 'dark' ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t('addYourRatingAs', { name: user?.first_name })}</h4>
          <StarRatingInput rating={newRating} setRating={setNewRating} />
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className={`w-full p-3 rounded transition ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400 border-transparent focus:ring-2 focus:ring-orange-500' : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent'}`}
            rows={4}
            placeholder={t('howWasExperiencePlaceholder')}
          />
          <button type="submit" className={`w-full md:w-auto px-6 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}>
            {t('submitRating')}
          </button>
        </form>
      )}

      {loading ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('loadingComments')}</div>
      ) : comments.length === 0 ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('noRatingsYet')}</div>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment.user_id} className={`p-5 rounded-lg border transition-shadow hover:shadow-lg ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600/70' : 'bg-white border-gray-200'}`}>
              {editingCommentId === comment.user_id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <StarRatingInput rating={editedRating} setRating={setEditedRating} />
                  <textarea
                    value={editedCommentText} // الآن هذه القيمة لن تكون null أبدًا
                    onChange={e => setEditedCommentText(e.target.value)}
                    className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900 border border-gray-300'}`}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold cursor-pointer">{t('save')}</button>
                    <button type="button" onClick={() => setEditingCommentId(null)} className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-semibold cursor-pointer">{t('cancel')}</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-400">{comment.user_name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{comment.user_name}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(comment.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        <span>{comment.rating}</span>
                        <span>★</span>
                      </div>
                      {user && user.id === comment.user_id && (
                        <div className="flex gap-3">
                          <button onClick={() => startEditing(comment)} className="text-blue-400 hover:text-blue-300 cursor-pointer">{t('edit')}</button>
                          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 cursor-pointer">{t('delete')}</button>
                        </div>
                      )}
                    </div>
                  </div>
                  {comment.comment && <p className={`whitespace-pre-wrap mt-4 pt-4 border-t ${theme === 'dark' ? 'text-gray-300 border-gray-600/50' : 'text-gray-700 border-gray-200'}`}>{comment.comment}</p>}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentsSection;