import React from 'react';
import tecconBg from '../../assets/IMAGEM VERTICAL LOGO MARCA.png';
import Logo from '../atoms/Logo';

const HeroBgPanel: React.FC = () => {
    return (
        <div className="relative hidden lg:flex flex-col justify-between w-1/2 overflow-hidden bg-white">
            {/* Background image */}
            <img
                src={tecconBg}
                alt="TECCON background"
                className="absolute inset-0 w-full h-full object-contain object-center" />

            {/* Gradient overlay — dark on bottom, semi-transparent on top */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d2d52]/60 via-[#0d2d52]/40 to-[#0a1e38]/90" />

            {/* Subtle noise texture for depth */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-10">
                {/* Top — Logo */}
                <Logo variant="light" size="md" />

                {/* Bottom — Tag line */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-[2px] bg-[#C8222A]" />
                        <span className="text-xs font-semibold uppercase tracking-[3px] text-white/50">
                            Sistema de Gestão do controle técnologico do concreto
                        </span>
                    </div>
                    <h2 className="text-white font-black text-4xl leading-tight tracking-tight"
                        style={{ fontFamily: "'Sora', sans-serif" }}>
                        Controle tecnológico<br />
                        <span className="text-[#FFD166]">inteligente</span> do concreto.
                    </h2>


                    <p className="mt-10 text-xs text-white/25">
                        © 20XX TECCON Engenharia e Tecnologia
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroBgPanel;