import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSettings: React.FC = () => {
    // ✅ استدعاء السياق للحصول على الحالة والدالة
    const { language, setLanguage } = useLanguage();

    const LanguageButton: React.FC<{ value: 'en' | 'ar'; label: string; }> = ({ value, label }) => (
        <button
            onClick={() => setLanguage(value)}
            className={`cursor-pointer w-full py-3 rounded-lg font-bold transition-colors duration-300 ${language === value ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            <LanguageButton value="en" label="English" />
            <LanguageButton value="ar" label="العربية" />
        </div>
    );
};

export default LanguageSettings;