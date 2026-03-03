import React from 'react';
import logoImg from '../../assets/logo png.png';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'dark' | 'light';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
    const sizes = {
        sm: { icon: 50, text: 'text-xl', sub: 'text-[9px]' },
        md: { icon: 65, text: 'text-2xl', sub: 'text-[10px]' },
        lg: { icon: 80, text: 'text-3xl', sub: 'text-[11px]' },
    };

    const s = sizes[size];
    const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
    const subColor = variant === 'light' ? 'text-white/60' : 'text-gray-400';

    return (
        <div className="flex items-center gap-3">
            <div
                className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: s.icon, height: s.icon }}
            >
                <img
                    src={logoImg}
                    alt="TECCON Logo"
                    style={{ width: s.icon, height: s.icon }}
                    className="object-contain flex-shrink-0"
                />            </div>
            <div>
                <div className={`font-black ${s.text} ${textColor} tracking-tight leading-none`}
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    TECCON
                </div>
                <div className={`${s.sub} ${subColor} tracking-[2.5px] uppercase font-light mt-1`}>
                    Engenharia e Tecnologia
                </div>
            </div>
        </div>
    );
};

export default Logo;