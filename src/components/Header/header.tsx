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
  .nav-link { 
    position: relative; 
    padding-bottom: 8px; 
    transition: color 0.3s ease; 
  }
  
  .nav-link::after { 
    content: ''; 
    position: absolute; 
    bottom: 0; 
    left: 0; 
    width: 100%; 
    height: 2px; 
    background-color: #f97316; 
    transform: scaleX(0); 
    transform-origin: bottom right; 
    transition: transform 0.3s ease-out; 
  }
  
  .nav-link:hover::after, 
  .nav-link.active::after { 
    transform: scaleX(1); 
    transform-origin: bottom left; 
  }
  
  .nav-link.active { 
    color: #f97316; 
  }

  .pulse-glow { 
    animation: glowPulse 0.3s ease-in-out; 
  }
  
  @keyframes glowPulse {
    0% { 
      text-shadow: 0 0 0px rgba(255,255,255,0); 
      box-shadow: 0 0 0px rgba(255,255,255,0); 
    }
    50% { 
      text-shadow: 0 0 6px rgba(255,255,255,0.2); 
      box-shadow: 0 0 6px rgba(255,255,255,0.2); 
    }
    100% { 
      text-shadow: 0 0 0px rgba(255,255,255,0); 
      box-shadow: 0 0 0px rgba(255,255,255,0); 
    }
  }

  /* Mobile menu transitions */
  .mobile-menu-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  
  .mobile-menu-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-in, transform 300ms ease-in;
  }
  
  .mobile-menu-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  .mobile-menu-exit-active {
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity 300ms ease-out, transform 300ms ease-out;
  }
`;

const AvatarSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`w-11 h-11 rounded-full animate-pulse ${
      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
    }`}></div>
  );
};

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm = "", 
  onSearchChange, 
  onSearchSubmit 
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [pulseTriggered, setPulseTriggered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle scroll effects
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

  // Handle local search changes
  const handleLocalSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (onSearchChange) {
      onSearchChange(e);
    }
  }, [onSearchChange]);

  // Handle search submit on Enter
  const handleLocalSearchSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  }, [onSearchSubmit]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setLocalSearchTerm('');
    if (onSearchChange) {
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onSearchChange(syntheticEvent);
    }
  }, [onSearchChange]);

  const avatarUrl = user?.avatar ? `${baseUrl}/storage/${user.avatar}` : DEFAULT_AVATAR;

  const headerClasses = `fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
    pulseTriggered ? 'pulse-glow' : ''
  } ${
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

  // Navigation items configuration
  const navigationItems = [
    { path: 'home', labelEn: 'Home', labelAr: 'الرئيسية' },
    { path: 'hotels', labelEn: 'Hotels', labelAr: 'الفنادق' },
    { path: 'restaurants', labelEn: 'Restaurants', labelAr: 'المطاعم' },
    { path: 'eventhalls', labelEn: 'Event Halls', labelAr: 'الصالات' },
    { path: 'playgrounds', labelEn: 'Playgrounds', labelAr: 'الملاعب' },
    { path: 'tours', labelEn: 'Tours', labelAr: 'الرحلات' },
  ];

  return (
    <>
      <style>{customHeaderStyles}</style>
      <header className={headerClasses}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link 
              to="/home" 
              className={`text-3xl font-extrabold transition-transform hover:scale-105 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`} 
              onClick={closeMobileMenu}
            >
              Mahjo<span className="text-orange-500">oz</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
              {navigationItems.map(item => (
                <NavLink 
                  key={item.path}
                  to={`/${item.path}`} 
                  className={navLinkClasses}
                >
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </NavLink>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Desktop Search */}
              <div className="relative hidden sm:block">
                <input 
                  type="text" 
                  placeholder={language === 'ar' ? 'ابحث...' : 'Search...'} 
                  value={localSearchTerm}
                  onChange={handleLocalSearchChange}
                  onKeyDown={handleLocalSearchSubmit}
                  className={`pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all w-32 md:w-48 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 shadow-sm placeholder-gray-500'
                  }`} 
                />
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                {/* Clear search button */}
                {localSearchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>

              {/* Profile Avatar */}
              <div className="flex items-center">
                {isAuthenticated && user ? (
                  <Link to="/profile" title={language === 'ar' ? 'الملف الشخصي' : 'Profile'}>
                    <img 
                      src={avatarUrl} 
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }} 
                      alt="Profile" 
                      className="w-11 h-11 rounded-full border-2 border-orange-500 hover:scale-110 transition-transform duration-300 object-cover cursor-pointer"
                    />
                  </Link>
                ) : (
                  <AvatarSkeleton />
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)} 
                  className={`cursor-pointer p-2 ${mobileMenuIconColor}`}
                >
                  <FaBars size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <CSSTransition 
        in={isMobileMenuOpen} 
        timeout={300} 
        classNames="mobile-menu" 
        unmountOnExit 
        nodeRef={mobileMenuRef}
      >
        <MobileMenu 
          user={user} 
          closeMenu={closeMobileMenu} 
          ref={mobileMenuRef} 
          logout={logout} 
          language={language} 
          theme={theme}
          searchTerm={localSearchTerm}
          onSearchChange={handleLocalSearchChange}
          onSearchSubmit={handleLocalSearchSubmit}
          onClearSearch={clearSearch}
          navigationItems={navigationItems}
        />
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
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  navigationItems: Array<{
    path: string;
    labelEn: string;
    labelAr: string;
  }>;
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(({ 
  user, 
  closeMenu, 
  logout, 
  language, 
  theme, 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  onClearSearch,
  navigationItems
}, ref) => {
  const menuBg = theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95';
  const linkColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900';
  const closeIconColor = theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';
  const separatorColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  return (
    <div 
      ref={ref} 
      className={`fixed inset-0 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 ${menuBg}`}
    >
      {/* Close Button */}
      <button 
        onClick={closeMenu} 
        className={`absolute top-6 right-6 transition-transform duration-300 hover:rotate-90 ${closeIconColor}`}
      >
        <FaTimes size={30} />
      </button>
      
      {/* Mobile Search Bar */}
      <div className="relative mb-8 w-full max-w-sm">
        <input 
          type="text" 
          placeholder={language === 'ar' ? 'ابحث...' : 'Search...'} 
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onSearchSubmit}
          className={`w-full pl-10 pr-4 py-3 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
            theme === 'dark'
              ? 'bg-gray-800/60 text-white placeholder-gray-400'
              : 'bg-gray-100 text-gray-900 placeholder-gray-500'
          }`} 
        />
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        
        {/* Clear search button */}
        {searchTerm && (
          <button 
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col items-center gap-y-6 text-center">
        {navigationItems.map(item => (
          <NavLink
            key={item.path}
            to={`/${item.path}`}
            onClick={closeMenu}
            className={`text-3xl font-bold ${linkColor} hover:text-orange-500 transition-colors`}
          >
            {language === 'ar' ? item.labelAr : item.labelEn}
          </NavLink>
        ))}
      </nav>

      {/* Account Links */}
      <div className={`mt-8 border-t pt-8 w-full flex flex-col items-center gap-y-6 ${separatorColor}`}>
        <NavLink 
          to="/profile" 
          onClick={closeMenu} 
          className={`text-2xl font-semibold ${linkColor} hover:text-orange-500 transition-colors flex items-center gap-3`}
        >
          <FaUser /> 
          <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
        </NavLink>
        
        <NavLink 
          to="/my-reservations" 
          onClick={closeMenu} 
          className={`text-2xl font-semibold ${linkColor} hover:text-orange-500 transition-colors flex items-center gap-3`}
        >
          <FaListAlt /> 
          <span>{language === 'ar' ? 'حجوزاتي' : 'My Reservations'}</span>
        </NavLink>
        
        <button 
          onClick={() => {
            logout();
            closeMenu();
          }} 
          className="cursor-pointer text-2xl font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-3"
        >
          <FaSignOutAlt /> 
          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default Header;