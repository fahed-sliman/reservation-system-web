import { Link } from 'react-router-dom';
// استيراد أيقونات احترافية
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* تقسيم رئيسي باستخدام Grid لمرونة أكبر على الشاشات المختلفة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* --- القسم الأول: حول الموقع والعلامة التجارية --- */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-white">
              Resser<span className="text-orange-500">Go</span>
            </Link>
            <p className="text-sm leading-relaxed">
              منصتك الأولى لاكتشاف وحجز أفضل الفنادق، قاعات المناسبات، المطاعم، والمزيد. نحن نضمن لك تجربة سلسة وموثوقة.
            </p>
            {/* أيقونات التواصل الاجتماعي */}
           
          </div>

          {/* --- القسم الثاني: روابط سريعة --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/hotels" className="hover:text-orange-400 transition-colors">الفنادق</Link></li>
              <li><Link to="/eventhalls" className="hover:text-orange-400 transition-colors">قاعات المناسبات</Link></li>
              <li><Link to="/restaurants" className="hover:text-orange-400 transition-colors">المطاعم</Link></li>
              <li><Link to="/playgrounds" className="hover:text-orange-400 transition-colors">الملاعب</Link></li>
              <li><Link to="/tours" className="hover:text-orange-400 transition-colors">الرحلات السياحية</Link></li>
            </ul>
          </div>

          {/* --- القسم الثالث: تواصل معنا --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-400 mt-1 flex-shrink-0" />
                <span> دمشق، سوريا</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-orange-400" />
                <a href="mailto:slymanmr693@gmail.com" className="hover:text-orange-400 transition-colors">contact@resserGo Team</a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-orange-400" />
                <a href="tel:+96395396264" className="hover:text-orange-400 transition-colors" dir="ltr">+963 959 396 264</a>
              </li>
            </ul>
          </div>
          
          {/* --- القسم الرابع: مطورو الموقع --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider">فريق التطوير</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">فهد سليمان</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">محمد الغزالي</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">ايمن المملوك</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">محمد الرفاعي</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer"> عمر الغوثاني</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ResserGo. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;