// src/contexts/LanguageContext.tsx

import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

// 1. تعريف النوع والواجهة
type Language = 'en' | 'ar';
interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

// 2. إنشاء السياق
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 3. إنشاء المزوّد (Provider)
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'en');

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};