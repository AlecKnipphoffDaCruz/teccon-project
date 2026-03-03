import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon, error, className = '', ...props }) => {
    return (
        <div className="relative w-full">
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    {icon}
                </span>
            )}
            <input
                className={`
          w-full h-12 rounded-xl border border-gray-200 bg-gray-50
          ${icon ? 'pl-11' : 'pl-4'} pr-4
          text-sm text-gray-800 font-medium placeholder-gray-400
          outline-none transition-all duration-200
          focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};

export default InputField;