import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaPalette, FaLanguage, FaCalendarCheck } from 'react-icons/fa';
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/Footer";
import LanguageSettings from "./LanguageSettings";
import AppearanceSettings from "./AppearanceSettings";

// ✅ 1. استيراد السياقات
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

// ✅ 2. تعريف الترجمات
const translations = {
    ar: {
        pageTitle: "إعدادات الحساب",
        pageDescription: "مركزك لإدارة تفضيلاتك وتفاصيل حسابك.",
        reservationsTitle: "حجوزاتي",
        reservationsDescription: "عرض أو إدارة أو إلغاء حجوزاتك القادمة والسابقة.",
        appearanceTitle: "المظهر",
        appearanceDescription: "خصص شكل التطبيق. يتم حفظ تفضيلاتك.",
        languageTitle: "اللغة",
        languageDescription: "اختر لغتك المفضلة لواجهة المستخدم.",
    },
    en: {
        pageTitle: "Account Settings",
        pageDescription: "Your central hub for managing your preferences and account details.",
        reservationsTitle: "My Reservations",
        reservationsDescription: "View, manage, or cancel your upcoming and past bookings.",
        appearanceTitle: "Appearance",
        appearanceDescription: "Customize how the application looks. Your preference is saved across sessions.",
        languageTitle: "Language",
        languageDescription: "Select your preferred language for the user interface.",
    },
};

const SettingsSection: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => {
    const { theme } = useTheme();
    return (
        <div className={`border rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className={`p-6 border-b flex items-start gap-5 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="bg-orange-500/20 text-orange-400 p-3 rounded-lg">{icon}</div>
                <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
                </div>
            </div>
            <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                {children}
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { theme } = useTheme();

    const t = useCallback((key: keyof typeof translations['en']) => translations[language][key] || key, [language]);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Header />
            <main className="max-w-4xl mx-auto py-24 px-4">
                <div className="text-center mb-16">
                    <h1 className={`text-5xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('pageTitle')}</h1>
                    <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('pageDescription')}</p>
                </div>

                <div className="space-y-10">
                    <button 
                        onClick={() => navigate('/my-reservations')}
                        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl flex items-center gap-5 text-left transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                        <FaCalendarCheck size={32} />
                        <div>
                            <h3 className="text-xl font-bold ">{t('reservationsTitle')}</h3>
                            <p className="text-blue-200">{t('reservationsDescription')}</p>
                        </div>
                    </button>
                    
                    <SettingsSection 
                        icon={<FaPalette size={24} />}
                        title={t('appearanceTitle')} 
                        description={t('appearanceDescription')}
                    >
                        <AppearanceSettings />
                    </SettingsSection>

                    <SettingsSection 
                        icon={<FaLanguage size={24} />}
                        title={t('languageTitle')} 
                        description={t('languageDescription')}
                    >
                        <LanguageSettings />
                    </SettingsSection>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SettingsPage;