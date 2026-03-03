import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'outline';
    loading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const base = `
    w-full h-12 rounded-xl font-semibold text-sm tracking-wide
    transition-all duration-200 cursor-pointer
    flex items-center justify-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-[#1A5FAD] text-white
      hover:bg-[#124080] hover:-translate-y-0.5
      shadow-[0_4px_18px_rgba(26,95,173,0.30)]
      hover:shadow-[0_6px_24px_rgba(26,95,173,0.40)]
      active:translate-y-0
    `,
        ghost: `
      bg-transparent text-[#1A5FAD] hover:bg-blue-50
    `,
        outline: `
      bg-transparent border border-dashed border-gray-300
      text-gray-600 hover:border-[#1A5FAD] hover:bg-blue-50/40
    `,
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ) : children}
        </button>
    );
};

export default Button;