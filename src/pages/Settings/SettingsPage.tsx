
import React from "react";
import { useNavigate } from "react-router-dom";
import {  FaPalette, FaLanguage, FaCalendarCheck } from 'react-icons/fa';
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/Footer";
import LanguageSettings from "./LanguageSettings";
import AppearanceSettings from "./AppearanceSettings";


const SettingsSection: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-start gap-5">
            <div className="bg-orange-500/20 text-orange-400 p-3 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
        </div>
        <div className="p-6 bg-gray-800">
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="max-w-4xl mx-auto py-24 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight">Account Settings</h1>
                    <p className="mt-4 text-lg text-gray-400">Your central hub for managing your preferences and account details.</p>
                </div>

                <div className="space-y-10">
                    {/* قسم حجوزاتي */}
                    <button 
                        onClick={() => navigate('/my-reservations')}
                        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl flex items-center gap-5 text-left transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                        <FaCalendarCheck size={32} />
                        <div>
                            <h3 className="text-xl font-bold ">My Reservations</h3>
                            <p className="text-blue-200">View, manage, or cancel your upcoming and past bookings.</p>
                        </div>
                    </button>
                    
                    {/* قسم المظهر */}
                    <SettingsSection 
                        icon={<FaPalette size={24} />}
                        title="Appearance" 
                        description="Customize how the application looks. Your preference is saved across sessions."
                    >
                        <AppearanceSettings />
                    </SettingsSection>

                    {/* قسم اللغة */}
                    <SettingsSection 
                        icon={<FaLanguage size={24} />}
                        title="Language" 
                        description="Select your preferred language for the user interface."
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