import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;