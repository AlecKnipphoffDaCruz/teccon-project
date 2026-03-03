import React from 'react';

interface AccessRequestBannerProps {
    onClick?: () => void;
}

const AccessRequestBanner: React.FC<AccessRequestBannerProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
        w-full flex items-center gap-3 px-4 py-3.5
        border border-dashed border-gray-300 rounded-xl
        hover:border-[#1A5FAD] hover:bg-blue-50/40
        transition-all duration-200 text-left group
      "
        >
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-200">
                <svg className="w-4 h-4 text-[#1A5FAD]" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#1A5FAD] transition-colors duration-200">
                    Acha que deveria ter acesso?
                </p>
                <span className="text-xs text-gray-400">Solicite acesso ao administrador do sistema</span>
            </div>
        </button>
    );
};

export default AccessRequestBanner;