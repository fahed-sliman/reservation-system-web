
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/Footer';
import StarRating from '../../components/Rattings/StarRating';

import { mockHotels, mockEventHalls, mockPlaygrounds, mockTours, mockRestaurants, mockRatings, mockTourStops } from '../../data/mockdata';
import type { RateableType, RatingInfo, TourStop } from '../../types';
import ItemDetailsCard from '../../components/MaxCard/itemDetailsCard';

const allData: Record<RateableType, any[]> = {
  hotel: mockHotels,
  event_hall: mockEventHalls,
  playground: mockPlaygrounds,
  tour: mockTours,
  restaurant: mockRestaurants,
};

const CURRENT_USER_ID = 1;

const getDummyUserName = (userId: number): string => {
  const users: Record<number, string> = {
    1: "fahed sliman",
    102: "فاطمة الزهراء",
    103: "علي المحمد",
    104: "ليلى مراد",
    105: "يوسف خالد",
  };
  return users[userId] || `مستخدم ${userId}`;
};

const CommentsSkeleton: React.FC = () => (
    <div className="mt-12 bg-gray-800/60 p-8 rounded-2xl border border-gray-700 animate-pulse">
      <div className="h-8 bg-gray-700 rounded-lg w-1/3 mb-8"></div>
      <div className="space-y-6">{[...Array(2)].map((_, i) => ( <div key={i} className="p-4 bg-gray-800 rounded-lg border border-gray-700"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gray-700"></div><div className="flex-grow space-y-2"><div className="h-5 bg-gray-700 rounded w-1/4"></div><div className="h-4 bg-gray-700 rounded w-1/5"></div></div></div><div className="h-4 bg-gray-700 rounded w-full mt-4"></div><div className="h-4 bg-gray-700 rounded w-3/4 mt-2"></div></div> ))}</div>
    </div>
);

const TourStopsSection: React.FC<{ stops: TourStop[] }> = ({ stops }) => {
  const [openStopId, setOpenStopId] = useState<number | null>(stops.length > 0 ? stops[0].id : null);
  const toggleStop = (id: number) => setOpenStopId(openStopId === id ? null : id);
  return (
    <section className="mt-12 bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700">
      <h3 className="text-3xl font-bold text-white mb-8">محطات الجولة</h3>
      <div className="space-y-4">{stops.map((stop) => (<div key={stop.id} className="border border-gray-700 rounded-lg overflow-hidden"><button onClick={() => toggleStop(stop.id)} className="w-full flex justify-between items-center p-5 bg-gray-800 hover:bg-gray-700/50 transition-colors"><div className="flex items-center gap-4"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold text-lg">{stop.sequence}</span><span className="font-semibold text-xl text-white">{stop.ar_title}</span></div><svg className={`w-6 h-6 text-gray-400 transition-transform ${openStopId === stop.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button><div className={`transition-all duration-500 ease-in-out ${openStopId === stop.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}><div className="p-5 border-t border-gray-700 space-y-4">{stop.image && <img src={stop.image} alt={stop.en_title} className="w-full h-56 object-cover rounded-lg mb-4" />}<p className="text-gray-300 leading-relaxed">{stop.ar_description}</p></div></div></div>))}</div>
    </section>
  );
};

// المكون الرئيسي للصفحة
const GenericDetailsPage: React.FC = () => {
  const { type, id } = useParams<{ type: RateableType; id: string }>();
  const itemId = Number(id);
  // ✅ تهيئة دالة التنقل
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [itemRatings, setItemRatings] = useState<RatingInfo[]>([]);
  const [tourStops, setTourStops] = useState<TourStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editingRating, setEditingRating] = useState(0);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);

  useEffect(() => { setLoading(true); const timer = setTimeout(() => { if (type && id) { const dataList = allData[type] || []; const foundItem = dataList.find((d) => d.id === itemId); setItem(foundItem); if (foundItem) { const ratings = mockRatings.filter((r) => r.rateable_type === type && r.rateable_id === itemId); setItemRatings(ratings); if (type === 'tour') { const stops = mockTourStops.filter(stop => stop.tour_id === itemId).sort((a, b) => a.sequence - b.sequence); setTourStops(stops); } } } setLoading(false); }, 1000); return () => clearTimeout(timer); }, [type, id, itemId]);
  
  const handleHotelBooking = () => {
    if (item) {
      navigate(`/hotel-rooms/${item.id}`);
    }
  };

  const handleDeleteComment = (commentId: number) => { if (window.confirm("هل أنت متأكد؟")) { alert(`سيتم حذف التعليق ${commentId}`); } };
  const handleEditComment = (comment: RatingInfo) => { setEditingCommentId(comment.id); setEditText(comment.comment || ''); setEditingRating(comment.rating); };
  const handleSaveEdit = () => { if (editingRating === 0) { alert('التقييم إجباري.'); return; } alert(`تم حفظ التعديلات`); setEditingCommentId(null); };
  const handleCancelEdit = () => { setEditingCommentId(null); };
  const handleSubmitNewComment = () => { if (newCommentRating === 0) { alert('التقييم إجباري.'); return; } alert(`تم إرسال تقييمك بنجاح!`); setNewCommentText(''); setNewCommentRating(0); };

  if (!loading && !item) { return ( <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white"> <Header /> <div className='flex-grow flex flex-col items-center justify-center'> <h1 className="text-6xl font-bold text-red-500">404</h1> <p className="text-2xl mt-4">العنصر غير موجود</p> <p className="text-gray-400 mt-2">يرجى التأكد من أن الرابط صحيح.</p> </div> <Footer /> </div> ); }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <ItemDetailsCard 
          loading={loading}
          item={item}
          type={type as RateableType} 
          // ✅ تمرير دالة حجز الفندق إلى البطاقة
          onBookHotelClick={handleHotelBooking}
        />
        
        {type === 'tour' && !loading && tourStops.length > 0 && (
          <TourStopsSection stops={tourStops} />
        )}

        {loading ? ( <CommentsSkeleton /> ) : (
          <section className="mt-12 bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700">
            <h3 className="text-3xl font-bold text-white mb-8">التقييمات والتعليقات</h3>
            <div className="space-y-6">
              {itemRatings.filter(r => r.comment || r.rating > 0).map((rating) => {
                  const isCurrentUserComment = rating.user_id === CURRENT_USER_ID;
                  return (
                    <div key={rating.id} className={`p-5 rounded-lg border transition-all ${isCurrentUserComment ? 'bg-orange-900/20 border-orange-500/30' : 'bg-gray-800 border-gray-700'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">{getDummyUserName(rating.user_id).charAt(0)}</div>
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <div><p className="font-semibold text-white text-lg flex items-center gap-2">{getDummyUserName(rating.user_id)}{isCurrentUserComment && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">تقييمك</span>}</p><p className="text-sm text-gray-400">{new Date(rating.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                            <StarRating rating={rating.rating} />
                          </div>
                          {editingCommentId === rating.id ? (
                            <div className="mt-4 space-y-3">
                              <StarRating rating={editingRating} setRating={setEditingRating} interactive />
                              <textarea className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white" value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} placeholder="التعليق اختياري..." />
                              <div className="flex justify-end gap-3 mt-2"><button onClick={handleSaveEdit} className=" cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>حفظ</button><button onClick={handleCancelEdit} className=" cursor-pointer flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>إلغاء</button></div>
                            </div>
                          ) : (
                            <div>
                              {rating.comment && <p className="text-gray-300 mt-3 text-base leading-relaxed">{rating.comment}</p>}
                              {isCurrentUserComment && (<div className="flex justify-end gap-4 mt-4"><button onClick={() => handleEditComment(rating)} className="cursor-pointer flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>تعديل</button><button onClick={() => handleDeleteComment(rating.id)} className="cursor-pointer flex items-center gap-2 text-sm text-red-400 hover:text-red-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16  "></path></svg>حذف</button></div>)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
              })}
            </div>
            <div className="mt-10 pt-8 border-t border-gray-700">
              <h4 className="text-2xl font-semibold text-white mb-4">أضف تقييمك</h4>
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 space-y-4">
                  <div>
                    <p className="text-lg text-gray-300 mb-2">اختر تقييمك: <span className="text-red-400">*</span></p>
                    <StarRating rating={newCommentRating} setRating={setNewCommentRating} interactive />
                  </div>
                  <textarea className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400" rows={4} placeholder="اكتب تعليقك هنا... (اختياري)" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} />
                  <button onClick={handleSubmitNewComment} className="cursor-pointer flex items-center justify-center gap-2 w-full mt-4 px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transform hover:scale-[1.02]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>إرسال التقييم</button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GenericDetailsPage;