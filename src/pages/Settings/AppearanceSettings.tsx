import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const AppearanceSettings: React.FC = () => {
    // ✅ استدعاء السياق للحصول على الحالة والدالة
    const { theme, setTheme } = useTheme();

    const ThemeButton: React.FC<{ value: 'light' | 'dark'; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
        <button
            onClick={() => setTheme(value)}
            className={`cursor-pointer flex flex-col items-center justify-center w-full p-4 rounded-lg border-2 transition-all duration-300 ${theme === value ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 text-gray-400'}`}
        >
            {icon}
            <span className="mt-2 font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            <ThemeButton value="light" label="Light" icon={<FaSun size={24} />} />
            <ThemeButton value="dark" label="Dark" icon={<FaMoon size={24} />} />
        </div>
    );
};

export default AppearanceSettings;