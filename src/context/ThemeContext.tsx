// src/contexts/ThemeContext.tsx

import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

// 1. تعريف نوع البيانات التي سيوفرها السياق
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// 2. إنشاء السياق مع قيمة ابتدائية undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. إنشاء "المزوّد" (Provider) الذي سيحتوي على المنطق
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // نفس منطق useState و useEffect الذي كان في المكون الأصلي
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark'); // إزالة أي كلاس قديم
        root.classList.add(theme); // إضافة الكلاس الحالي
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. إنشاء Hook مخصص لتسهيل استخدام السياق في أي مكون
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};