import React from 'react';
import HeroBgPanel from '../organisms/HeroBgPanel';
import LoginForm from '../organisms/LoginForm';
import Logo from '../atoms/Logo';

interface LoginTemplateProps {
    onLogin?: (user: string, password: string) => void;
    loading?: boolean;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ onLogin, loading }) => {
    return (
        <div className="flex min-h-screen bg-[#EDEEF2]">
            {/* Left — hero image panel */}
            <HeroBgPanel />

            {/* Right — login form panel */}
            <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile-only logo */}
                    <div className="flex justify-center mb-8 lg:hidden">
                        <Logo variant="dark" size="md" />
                    </div>

                    {/* Card */}
                    <div
                        className="bg-white rounded-2xl p-10 shadow-[0_8px_40px_rgba(26,95,173,0.10),_0_2px_8px_rgba(0,0,0,0.06)]"
                        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) both' }}
                    >
                        <div className="mb-7">
                            <h1 className="text-2xl font-black text-gray-800 tracking-tight"
                                style={{ fontFamily: "'Sora', sans-serif" }}>
                                Bem-vindo de volta
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Acesse sua conta para continuar
                            </p>
                        </div>

                        <div className="h-px bg-gray-100 mb-7" />

                        <LoginForm onSubmit={onLogin} loading={loading} />
                    </div>
                </div>
            </div>

            {/* keyframes injected globally — or move to index.css */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default LoginTemplate;