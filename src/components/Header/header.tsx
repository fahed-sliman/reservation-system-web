import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaUser, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import type { User } from '../../types/auth';
import { CSSTransition } from 'react-transition-group';

const baseUrl = "http://127.0.0.1:8000";
const DEFAULT_AVATAR = "/download (1).jpeg";

const customHeaderStyles = `
  .nav-link { position: relative; padding-bottom: 8px; transition: color 0.3s ease; }
  .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #f97316; transform: scaleX(0); transform-origin: bottom right; transition: transform 0.3s ease-out; }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); transform-origin: bottom left; }
  .nav-link.active { color: #f97316; }

  .mobile-menu-enter { opacity: 0; transform: scale(0.95); }
  .mobile-menu-enter-active { opacity: 1; transform: scale(1); transition: opacity 300ms, transform 300ms; }
  .mobile-menu-exit { opacity: 1; transform: scale(1); }
  .mobile-menu-exit-active { opacity: 0; transform: scale(0.95); transition: opacity 300ms, transform 300ms; }
`;

// === مكون الهيكل للـ Avatar ===
const AvatarSkeleton: React.FC = () => (
  <div className="w-11 h-11 rounded-full bg-gray-700 animate-pulse"></div>
);

// === المكون الرئيسي للهيدر ===
const Header: React.FC = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✅  تم إنشاء Ref وتمريره إلى CSSTransition و MobileMenu لإصلاح مشكلة الظهور
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // جلب بيانات المستخدم
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch(`${baseUrl}/api/user/profile`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => setUser(data.user || null))
        .catch(error => {
          console.error("Failed to fetch user for header:", error);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [token]);

  // تأثير التمرير
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const avatarUrl = user?.avatar ? `${baseUrl}/storage/${user.avatar}` : DEFAULT_AVATAR;

  return (
    <>
      <style>{customHeaderStyles}</style>
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-gray-900/90 backdrop-blur-lg shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/home" className="text-3xl font-extrabold text-white transition-transform hover:scale-105" onClick={closeMobileMenu}>
              Resser<span className="text-orange-500">Go</span>
            </Link>

            {/* Desktop navi */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <NavLink to="/home" className="nav-link text-gray-300 hover:text-white">الرئيسية</NavLink>
              <NavLink to="/hotels" className="nav-link text-gray-300 hover:text-white">الفنادق</NavLink>
              <NavLink to="/restaurants" className="nav-link text-gray-300 hover:text-white">المطاعم</NavLink>
              <NavLink to="/eventhalls" className="nav-link text-gray-300 hover:text-white">الصالات</NavLink>
              <NavLink to="/playgrounds" className="nav-link text-gray-300 hover:text-white">الملاعب</NavLink>
              <NavLink to="/tours" className="nav-link text-gray-300 hover:text-white">الرحلات</NavLink>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input type="text" placeholder="ابحث..." className="pl-10 pr-4 py-2.5 rounded-full text-white placeholder-gray-400 bg-gray-800/60 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-gray-700 transition-all w-32 md:w-48"/>
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex items-center">
                {loading ? (
                  <AvatarSkeleton />
                ) : user ? (
                  <Link to="/profile" title="الملف الشخصي">
                    <img 
                      src={avatarUrl} 
                      onError={(e) => { (e.currentTarget.src = DEFAULT_AVATAR); }} 
                      alt="Profile" 
                      className="w-11 h-11 rounded-full border-2 border-orange-500 hover:scale-110 transition-transform duration-300 object-cover cursor-pointer"
                    />
                  </Link>
                ) : (
                  // ✅ تم استبدال زر تسجيل الدخول بأيقونة
                  <Link to="/login" title="تسجيل الدخول" className="w-11 h-11 flex items-center justify-center rounded-full text-white bg-gray-800/60 border border-gray-700 hover:bg-gray-700 hover:text-orange-500 transition-colors">
                    <FaUser size={20}/>
                  </Link>
                )}
              </div>
              
              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="cursor-pointer text-white p-2">
                  <FaBars size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>


      <CSSTransition in={isMobileMenuOpen} timeout={300} classNames="mobile-menu" unmountOnExit nodeRef={mobileMenuRef}>
        <MobileMenu user={user} closeMenu={closeMobileMenu} ref={mobileMenuRef}/>
      </CSSTransition>
    </>
  );
};

const MobileMenu = React.forwardRef<HTMLDivElement, { user: User | null; closeMenu: () => void }>(({ user, closeMenu }, ref) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate('/login');
  };

  return (
    <div ref={ref} className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
      <button onClick={closeMenu} className="cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-white transition-transform duration-300 hover:rotate-90">
        <FaTimes size={30} />
      </button>
      
      <nav className="flex flex-col items-center gap-y-6 text-center">
        <NavLink to="/home" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">الرئيسية</NavLink>
        <NavLink to="/hotels" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">الفنادق</NavLink>
        <NavLink to="/restaurants" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">المطاعم</NavLink>
        <NavLink to="/eventhalls" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">الصالات</NavLink>
        <NavLink to="/playgrounds" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">الملاعب</NavLink>
        <NavLink to="/tours" onClick={closeMenu} className="text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors">الرحلات</NavLink>
      
        <div className="mt-8 border-t border-gray-700 pt-8 w-full flex flex-col items-center gap-y-6">
          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className="text-2xl font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-3">
                <FaUser /> <span>الملف الشخصي</span>
              </NavLink>
              <NavLink to="/my-reservations" onClick={closeMenu} className="text-2xl font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-3">
                <FaListAlt /> <span>حجوزاتي</span>
              </NavLink>
              <button onClick={handleLogout} className="cursor-pointer text-2xl font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-3">
                <FaSignOutAlt /> <span>تسجيل الخروج</span>
              </button>
            </>
          ) : (
            // ✅ تمت إضافة رابط تسجيل الدخول للمستخدم غير المسجل
            <NavLink to="/login" onClick={closeMenu} className="text-2xl font-semibold text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-3">
               <FaUser /> <span>تسجيل الدخول</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
});

export default Header;