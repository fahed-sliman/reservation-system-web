import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const translations = {
  ar: { light: "فاتح", dark: "داكن" },
  en: { light: "Light", dark: "Dark" },
};

const AppearanceSettings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { language } = useLanguage();

    const t = (key: keyof typeof translations['en']) => translations[language][key] || key;

    const ThemeButton: React.FC<{ value: 'light' | 'dark'; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
        <button
            onClick={() => setTheme(value)}
            className={`cursor-pointer flex flex-col items-center justify-center w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                theme === value 
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                    : (theme === 'dark' 
                        ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500 text-gray-400'
                        : 'bg-gray-100 border-gray-300 hover:border-gray-400 text-gray-500'
                    )
            }`}
        >
            {icon}
            <span className="mt-2 font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            <ThemeButton value="light" label={t('light')} icon={<FaSun size={24} />} />
            <ThemeButton value="dark" label={t('dark')} icon={<FaMoon size={24} />} />
        </div>
    );
};

export default AppearanceSettings;