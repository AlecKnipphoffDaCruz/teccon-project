import React from 'react';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ error, className = '', ...props }) => {
  return (
    <div className="relative w-full">
      <textarea
        className={`
          w-full rounded-xl border border-gray-200 bg-gray-50
          px-4 py-3 text-sm text-gray-800 font-medium placeholder-gray-400
          outline-none transition-all duration-200 resize-none
          focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        rows={3}
        {...props}
      />
      {error && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default TextareaField;