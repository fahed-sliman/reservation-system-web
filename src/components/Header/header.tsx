import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaUser, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { CSSTransition } from 'react-transition-group';

const DEFAULT_AVATAR = "/download (1).jpeg";
const baseUrl = "http://127.0.0.1:8000";

const customHeaderStyles = `
  .nav-link { position: relative; padding-bottom: 8px; transition: color 0.3s ease; }
  .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #f97316; transform: scaleX(0); transform-origin: bottom right; transition: transform 0.3s ease-out; }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); transform-origin: bottom left; }
  .nav-link.active { color: #f97316; }

  .pulse-glow { animation: glowPulse 0.3s ease-in-out; }
  @keyframes glowPulse {
    0% { text-shadow: 0 0 0px rgba(255,255,255,0); box-shadow: 0 0 0px rgba(255,255,255,0); }
    50% { text-shadow: 0 0 6px rgba(255,255,255,0.2); box-shadow: 0 0 6px rgba(255,255,255,0.2); }
    100% { text-shadow: 0 0 0px rgba(255,255,255,0); box-shadow: 0 0 0px rgba(255,255,255,0); }
  }
`;

const AvatarSkeleton: React.FC = () => {
    const { theme } = useTheme();
    return <div className={`w-11 h-11 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>;
};

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [pulseTriggered, setPulseTriggered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 5) {
        if (!isScrolled) {
          setPulseTriggered(true);
          setIsScrolled(true);
          setTimeout(() => setPulseTriggered(false), 300);
        }
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const avatarUrl = user?.avatar ? `${baseUrl}/storage/${user.avatar}` : DEFAULT_AVATAR;

  const headerClasses = `fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${pulseTriggered ? 'pulse-glow' : ''} ${
    isScrolled
      ? theme === 'dark'
        ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg shadow-black/20'
        : 'bg-white/90 backdrop-blur-lg shadow-lg shadow-gray-200/50'
      : 'bg-transparent'
  }`;

  const navLinkClasses = `nav-link ${
    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
  }`;

  const mobileMenuIconColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <>
      <style>{customHeaderStyles}</style>
      <header className={headerClasses}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <Link to="/home" className={`text-3xl font-extrabold transition-transform hover:scale-105 ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={closeMobileMenu}>
             Mahjo<span className="text-orange-500">oz</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
              <NavLink to="/home" className={navLinkClasses}>{language==='ar'?'الرئيسية':'Home'}</NavLink>
              <NavLink to="/hotels" className={navLinkClasses}>{language==='ar'?'الفنادق':'Hotels'}</NavLink>
              <NavLink to="/restaurants" className={navLinkClasses}>{language==='ar'?'المطاعم':'Restaurants'}</NavLink>
              <NavLink to="/eventhalls" className={navLinkClasses}>{language==='ar'?'الصالات':'Event Halls'}</NavLink>
              <NavLink to="/playgrounds" className={navLinkClasses}>{language==='ar'?'الملاعب':'Playgrounds'}</NavLink>
              <NavLink to="/tours" className={navLinkClasses}>{language==='ar'?'الرحلات':'Tours'}</NavLink>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input 
                  type="text" 
                  placeholder={language==='ar'?'ابحث...':'Search...'} 
                  className={`pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all w-32 md:w-48 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`} 
                />
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center">
                {isAuthenticated && user ? (
                  <Link to="/profile" title={language==='ar'?'الملف الشخصي':'Profile'}>
                    <img 
                      src={avatarUrl} 
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }} 
                      alt="Profile" 
                      className="w-11 h-11 rounded-full border-2 border-orange-500 hover:scale-110 transition-transform duration-300 object-cover cursor-pointer"
                    />
                  </Link>
                ) : <AvatarSkeleton />}
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className={`cursor-pointer p-2 ${mobileMenuIconColor}`}>
                  <FaBars size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CSSTransition in={isMobileMenuOpen} timeout={300} classNames="mobile-menu" unmountOnExit nodeRef={mobileMenuRef}>
        <MobileMenu user={user} closeMenu={closeMobileMenu} ref={mobileMenuRef} logout={logout} language={language} theme={theme} />
      </CSSTransition>
    </>
  );
};

interface MobileMenuProps {
  user: any;
  closeMenu: () => void;
  logout: () => void;
  language: string;
  theme: string;
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(({ user, closeMenu, logout, language, theme }, ref) => {
  const menuBg = theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95';
  const linkColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900';
  const closeIconColor = theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';
  const separatorColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  return (
    <div ref={ref} className={`fixed inset-0 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 ${menuBg}`}>
      <button onClick={closeMenu} className={`absolute top-6 right-6 transition-transform duration-300 hover:rotate-90 ${closeIconColor}`}>
        <FaTimes size={30} />
      </button>
      <nav className="flex flex-col items-center gap-y-6 text-center">
        {['Home', 'Hotels', 'Restaurants', 'Event Halls', 'Playgrounds', 'Tours'].map((item) => (
            <NavLink
                key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                onClick={closeMenu}
                className={`text-3xl font-bold ${linkColor} hover:text-orange-500 transition-colors`}
            >
                {language === 'ar' ? 
                    {'Home':'الرئيسية', 'Hotels':'الفنادق', 'Restaurants':'المطاعم', 'Event Halls':'الصالات', 'Playgrounds':'الملاعب', 'Tours':'الرحلات'}[item]
                    : item
                }
            </NavLink>
        ))}
        <div className={`mt-8 border-t pt-8 w-full flex flex-col items-center gap-y-6 ${separatorColor}`}>
          <NavLink to="/profile" onClick={closeMenu} className={`text-2xl font-semibold ${linkColor} hover:text-orange-500 transition-colors flex items-center gap-3`}>
            <FaUser /> <span>{language==='ar'?'الملف الشخصي':'Profile'}</span>
          </NavLink>
          <NavLink to="/my-reservations" onClick={closeMenu} className={`text-2xl font-semibold ${linkColor} hover:text-orange-500 transition-colors flex items-center gap-3`}>
            <FaListAlt /> <span>{language==='ar'?'حجوزاتي':'My Reservations'}</span>
          </NavLink>
          <button onClick={logout} className="cursor-pointer text-2xl font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-3">
            <FaSignOutAlt /> <span>{language==='ar'?'تسجيل الخروج':'Logout'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
});

export default Header;